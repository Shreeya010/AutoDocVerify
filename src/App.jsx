import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const documentTypes = [
  { key: "10th_marksheet", label: "10th Marksheet", required: true },
  { key: "12th_marksheet", label: "12th/Diploma Marksheet", required: true },
  { key: "cet_scorecard", label: "CET Scorecard", required: true },
  { key: "leaving_certificate", label: "Leaving Certificate", required: true },
  { key: "caste_certificate", label: "Caste Certificate", required: false },
];

const emptyDocuments = Object.fromEntries(
  documentTypes.map((doc) => [
    doc.key,
    {
      label: doc.label,
      submitted: false,
      status: "Not Submitted",
      confidence: "-",
      matched_fields: [],
      mismatched_fields: [],
    },
  ])
);

const statusClass = {
  VERIFIED: "status status-ok",
  Verified: "status status-ok",
  WARNING: "status status-warn",
  Warning: "status status-warn",
  PENDING: "status status-pending",
  Pending: "status status-pending",
  FAILED: "status status-bad",
  Failed: "status status-bad",
  "Not Submitted": "status status-muted",
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loginRole, setLoginRole] = useState("student");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [studentPage, setStudentPage] = useState("upload");
  const [adminPage, setAdminPage] = useState("verification");
  const [filter, setFilter] = useState("All");
  const [documents, setDocuments] = useState(emptyDocuments);
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, failed: 0, not_submitted: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function api(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || "Request failed");
    }
    return data;
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (loginRole === "student") {
        const data = await api("/api/auth/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ application_id: loginId, password }),
        });
        setSession({ role: "student", id: data.application_id });
        setStudent(data.student);
        setDocuments(data.documents || emptyDocuments);
      } else {
        const data = await api("/api/auth/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: loginId, password }),
        });
        setSession({ role: "admin", id: data.username });
        await loadAdminData();
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAdminData() {
    const [statsData, rowsData] = await Promise.all([
      api("/api/admin/stats"),
      api("/api/admin/applications"),
    ]);
    setStats(statsData);
    setApplications(rowsData.applications || []);
  }

  async function handleUpload(docKey, fileList) {
    const file = fileList?.[0];
    if (!file || !session?.id) return;

    const body = new FormData();
    body.append("file", file);

    setLoading(true);
    setMessage(`Processing ${file.name}. OCR can take a while.`);

    try {
      const data = await api(`/api/students/${session.id}/documents/${docKey}`, {
        method: "POST",
        body,
      });
      setDocuments(data.documents || emptyDocuments);
      setMessage(`${file.name} processed successfully.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setSession(null);
    setLoginId("");
    setPassword("");
    setMessage("");
    setStudent(null);
    setDocuments(emptyDocuments);
  }

  if (!session) {
    return (
      <LoginScreen
        role={loginRole}
        setRole={setLoginRole}
        loginId={loginId}
        setLoginId={setLoginId}
        password={password}
        setPassword={setPassword}
        onLogin={handleLogin}
        loading={loading}
        message={message}
      />
    );
  }

  return (
    <main className="app-shell">
      <Topbar session={session} student={student} onLogout={logout} />

      {message && <div className="global-message">{message}</div>}

      <div className="app-grid">
        {session.role === "student" ? (
          <>
            <Sidebar
              title="Student Portal"
              active={studentPage}
              setActive={setStudentPage}
              items={[
                ["upload", "Upload Documents"],
                ["status", "Verification Status"],
                ["profile", "Student Profile"],
              ]}
            />
            <StudentPages
              page={studentPage}
              student={student}
              session={session}
              documents={documents}
              onUpload={handleUpload}
              loading={loading}
            />
          </>
        ) : (
          <>
            <Sidebar
              title="Admin Portal"
              active={adminPage}
              setActive={setAdminPage}
              items={[
                ["verification", "Verification Panel"],
                ["students", "Student Records"],
                ["reports", "Reports"],
              ]}
            />
            <AdminPages
              page={adminPage}
              filter={filter}
              setFilter={setFilter}
              applications={applications}
              stats={stats}
              reload={loadAdminData}
            />
          </>
        )}
      </div>
    </main>
  );
}

function LoginScreen({ role, setRole, loginId, setLoginId, password, setPassword, onLogin, loading, message }) {
  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-panel">
          <img src="/adv-logo.png" alt="ADV Auto-Doc Verify logo" className="brand-logo large" />
          <p className="eyebrow">Auto-Doc Verify</p>
          <h1>AI Academic Verification System</h1>
          <p>Connected React, Python OCR API, and MongoDB workflow for student academic verification.</p>
        </div>

        <form className="login-form" onSubmit={onLogin}>
          <div className="mobile-brand">
            <img src="/adv-logo.png" alt="ADV logo" className="brand-logo" />
            <div>
              <p className="eyebrow">Auto-Doc Verify</p>
              <h2>Sign in</h2>
            </div>
          </div>

          <div className="role-tabs">
            <button type="button" className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>
              Student Login
            </button>
            <button type="button" className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>
              Admin Login
            </button>
          </div>

          <label className="field">
            <span>{role === "student" ? "Application ID" : "Admin Username"}</span>
            <input
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              placeholder={role === "student" ? "APP0001" : "admin"}
              required
            />
          </label>

          <label className="field">
            <span>{role === "student" ? "Date of Birth / Password" : "Password"}</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Checking..." : `Continue to ${role === "student" ? "Student Dashboard" : "Admin Panel"}`}
          </button>

          {message && <p className="error-note">{message}</p>}
          <p className="note">Student login uses application ID + DOB from MongoDB. Admin defaults are from your backend settings.</p>
        </form>
      </section>
    </main>
  );
}

function Topbar({ session, student, onLogout }) {
  const displayName = session.role === "student" ? student?.student_name || session.id : session.id;
  return (
    <header className="topbar">
      <div className="brand-row">
        <img src="/adv-logo.png" alt="ADV Auto-Doc Verify logo" className="brand-logo" />
        <div>
          <p className="eyebrow">Auto-Doc Verify</p>
          <h1>AI Academic Verification System</h1>
        </div>
      </div>
      <div className="topbar-actions">
        <span className="session-pill">{session.role.toUpperCase()} · {displayName}</span>
        <button type="button" className="ghost-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

function Sidebar({ title, items, active, setActive }) {
  return (
    <aside className="sidebar">
      <p className="sidebar-title">{title}</p>
      {items.map(([key, label]) => (
        <button key={key} type="button" className={active === key ? "nav-item active" : "nav-item"} onClick={() => setActive(key)}>
          {label}
        </button>
      ))}
    </aside>
  );
}

function StudentPages({ page, student, session, documents, onUpload, loading }) {
  if (page === "status") return <StudentStatus documents={documents} />;
  if (page === "profile") return <StudentProfile student={student} session={session} />;
  return <UploadDocuments documents={documents} onUpload={onUpload} loading={loading} />;
}

function UploadDocuments({ documents, onUpload, loading }) {
  return (
    <section className="content-stack">
      <PageHeader
        eyebrow="Student Dashboard"
        title="Upload Documents"
        description="Upload documents to the Python backend. The API saves the file, runs OCR, verifies against MongoDB, and returns the latest status."
      />

      <div className="document-grid">
        {documentTypes.map((doc) => (
          <article className="doc-card" key={doc.key}>
            <div className="doc-head">
              <div>
                <h3>{doc.label}</h3>
                <p>{doc.required ? "Required" : "Optional"} · PNG, JPG, JPEG, PDF</p>
              </div>
              <StatusBadge status={documents[doc.key]?.status || "Not Submitted"} />
            </div>

            <label className={loading ? "upload-zone disabled" : "upload-zone"}>
              <span>{loading ? "Processing..." : "Choose document file"}</span>
              <small>Upload to OCR backend</small>
              <input disabled={loading} type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={(event) => onUpload(doc.key, event.target.files)} />
            </label>

            <p className="card-note">
              Confidence: {documents[doc.key]?.confidence ?? "-"} · Matched fields: {documents[doc.key]?.matched_fields?.length || 0}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function StudentStatus({ documents }) {
  return (
    <section className="content-stack">
      <PageHeader eyebrow="Verification" title="Verification Status" description="Live document status loaded from MongoDB." />
      <DataTable
        columns={["Document", "Submitted", "Confidence", "Status", "Mismatches"]}
        rows={documentTypes.map((doc) => [
          doc.label,
          documents[doc.key]?.submitted ? "Yes" : "No",
          documents[doc.key]?.confidence ?? "-",
          <StatusBadge status={documents[doc.key]?.status || "Not Submitted"} />,
          formatMismatches(documents[doc.key]?.mismatched_fields),
        ])}
      />
    </section>
  );
}

function StudentProfile({ student, session }) {
  return (
    <section className="content-stack">
      <PageHeader eyebrow="Profile" title="Student Profile" description="Loaded from the students collection in MongoDB." />
      <div className="metric-grid">
        <MetricCard label="Application ID" value={session.id} />
        <MetricCard label="Student Name" value={student?.student_name || "-"} />
        <MetricCard label="DOB" value={student?.dob || "-"} />
        <MetricCard label="Category" value={student?.category || "-"} />
      </div>
    </section>
  );
}

function AdminPages({ page, filter, setFilter, applications, stats, reload }) {
  useEffect(() => {
    reload().catch(() => undefined);
  }, []);

  if (page === "students") return <AdminStudents applications={applications} />;
  if (page === "reports") return <AdminReports stats={stats} />;
  return <AdminVerification filter={filter} setFilter={setFilter} applications={applications} stats={stats} reload={reload} />;
}

function AdminVerification({ filter, setFilter, applications, stats, reload }) {
  const filteredRows = useMemo(() => {
    if (filter === "All") return applications;
    return applications.filter((row) => row.status === filter);
  }, [filter, applications]);

  const metrics = [
    ["Total Students", stats.total],
    ["Verified", stats.verified],
    ["Pending", stats.pending],
    ["Failed", stats.failed],
  ];

  return (
    <section className="content-stack">
      <PageHeader eyebrow="Admin Dashboard" title="Verification Panel" description="Real applications loaded from MongoDB through the Python API." />
      <div className="metric-grid">
        {metrics.map(([label, value]) => <MetricCard key={label} label={label} value={value} />)}
      </div>
      <div className="table-panel">
        <div className="table-toolbar">
          <h3>Applications</h3>
          <button type="button" className="ghost-btn compact" onClick={reload}>Refresh</button>
          <div className="filter-tabs">
            {["All", "Verified", "Pending", "Failed"].map((item) => (
              <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        {filteredRows.length ? <ApplicationsTable rows={filteredRows} /> : <EmptyState title="No applications found" text="No students were returned from MongoDB for this filter." />}
      </div>
    </section>
  );
}

function AdminStudents({ applications }) {
  return (
    <section className="content-stack">
      <PageHeader eyebrow="Records" title="Student Records" description="Student records loaded from MongoDB." />
      {applications.length ? <ApplicationsTable rows={applications} /> : <EmptyState title="No records available" text="Check MongoDB connection or load students into the students collection." />}
    </section>
  );
}

function AdminReports({ stats }) {
  return (
    <section className="content-stack">
      <PageHeader eyebrow="Reports" title="Verification Reports" description="Computed from real MongoDB application and document records." />
      <div className="metric-grid">
        <MetricCard label="Total Students" value={stats.total} />
        <MetricCard label="Not Submitted" value={stats.not_submitted} />
        <MetricCard label="Verified" value={stats.verified} />
        <MetricCard label="Failed" value={stats.failed} />
      </div>
    </section>
  );
}

function ApplicationsTable({ rows }) {
  return (
    <DataTable
      columns={["Application ID", "Student", "Course", "Docs", "Confidence", "Status"]}
      rows={rows.map((row) => [
        row.application_id,
        row.student_name || "-",
        row.course || "-",
        row.documents_count,
        row.confidence,
        <StatusBadge status={row.status} />,
      ])}
    />
  );
}

function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">ADV</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <strong>{value ?? "-"}</strong>
    </article>
  );
}

function StatusBadge({ status }) {
  return <span className={statusClass[status] || "status status-muted"}>{status}</span>;
}

function formatMismatches(mismatches = []) {
  if (!mismatches.length) return "-";
  return mismatches.map((item) => `${item.field}: OCR ${item.ocr_value || "-"} / DB ${item.db_value || "-"}`).join("; ");
}
