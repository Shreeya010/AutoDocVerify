# 📄 Automated Document Verification System using NLP

An AI-powered document verification system developed using **React**, **FastAPI**, **OCR**, **MongoDB**, and **Machine Learning** to automate academic document verification with intelligent text extraction and validation.

---

# 🚀 Features

✅ Upload PDF and image documents
✅ OCR-based text extraction using EasyOCR
✅ AI-powered OCR reconstruction using Groq LLM
✅ Automatic document verification
✅ MongoDB database integration
✅ Student & Admin dashboards
✅ Confidence score generation
✅ Verification status detection
✅ Real-time monitoring system
✅ Responsive modern UI using Tailwind CSS

---

# 🛠 Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Vite

## Backend

* Python
* FastAPI / Flask API
* OCR Pipeline

## Database

* MongoDB

## AI & OCR

* EasyOCR
* OpenCV
* Groq LLM API
* PyMuPDF
* NumPy
* Pillow

---

# 📂 Project Structure

```bash
Automated-Document-Verification-System/
│
├── public/                     # Static frontend files
├── src/                        # React frontend source code
├── uploads/                    # Uploaded document storage
│
├── backend_api.py              # Main backend API
├── mongodb.py                  # MongoDB database connection
├── ocr_pipeline.py             # OCR processing pipeline
├── test_ocr.py                 # OCR testing script
├── test_pipeline.py            # Full pipeline testing
│
├── backend_requirements.txt    # Python dependencies
│
├── package.json                # Frontend dependencies
├── package-lock.json
│
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── index.html                  # Main frontend HTML
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/Automated-Document-Verification-System.git

cd Automated-Document-Verification-System
```

---

# 🖥 Backend Setup

Install backend dependencies:

```bash
pip install -r backend_requirements.txt
```

Run backend server:

```bash
python backend_api.py
```

---

# 🌐 Frontend Setup

Install frontend dependencies:

```bash
npm install
```

Run frontend server:

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
MONGODB_URL=your_mongodb_connection_url
DATABASE_NAME=your_database_name
```

---

# 🏗 System Architecture

![Architecture](screenshots/architecture.png)

---

# 🔄 System Workflow

1. User uploads academic document
2. PDF converted into images
3. Image preprocessing performed
4. OCR extracts text from document
5. AI reconstructs noisy OCR text
6. Information extracted into JSON format
7. Data verified against MongoDB records
8. Verification status generated

---

# 📸 Screenshots

## 🔐 Student Login

![Student Login](screenshots/student_login.png)

---

## 🔐 Admin Login

![Admin Login](screenshots/admin_login.png)

---

## 👨‍🎓 Student Dashboard

![Student Dashboard](screenshots/student_dashboard.png)

---

## 👨‍💼 Admin Dashboard

![Admin Dashboard](screenshots/admin_dashboard.png)

---

## 📄 Document Upload

![Document Upload](screenshots/upload_page.png)

---

## 📊 Verification Result

![Verification Result](screenshots/verification_result.png)

---

# 🔥 Main Modules

## 📄 OCR Pipeline

* Extracts text from PDFs and images
* Uses EasyOCR for OCR processing
* Handles image preprocessing and enhancement

## 🤖 AI Reconstruction Module

* Uses Groq LLM API
* Corrects OCR mistakes
* Improves text quality and structure

## 📊 Verification Engine

* Matches extracted information with MongoDB records
* Generates:

  * VERIFIED
  * WARNING
  * FAILED statuses

## 🗄 Database Module

Stores:

* Student records
* Uploaded documents
* OCR extracted data
* Verification results
* Confidence scores

## 👨‍💼 Dashboard Module

Admin dashboard provides:

* Verification statistics
* Failed applications
* Monitoring tools
* Real-time updates

---

# 📈 Verification Status

| Status     | Meaning                       |
| ---------- | ----------------------------- |
| ✅ VERIFIED | Document successfully matched |
| ⚠️ WARNING | Partial mismatch detected     |
| ❌ FAILED   | Verification unsuccessful     |

---

# 🧪 Testing

Run OCR testing:

```bash
python test_ocr.py
```

Run full pipeline testing:

```bash
python test_pipeline.py
```

---

# 🎯 Objectives

* Automate document verification
* Reduce manual effort
* Improve accuracy
* Support PDF & image documents
* Detect mismatches intelligently
* Generate verification reports

---

# 🔮 Future Scope

* 🌍 Multilingual OCR support
* ✍️ Handwritten text recognition
* ☁️ Cloud deployment
* 🔗 Blockchain-based verification
* 👤 Face recognition integration
* 🤖 AI document classification

---

# 📚 Libraries Used

## Backend Libraries

* FastAPI
* EasyOCR
* OpenCV
* NumPy
* Pillow
* PyMuPDF
* Pydantic
* MongoDB Driver

## Frontend Libraries

* React.js
* Tailwind CSS
* Vite
* PostCSS
* Autoprefixer
