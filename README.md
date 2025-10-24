# 📚 ExamPrep - Online Examination Management System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Express.js](https://img.shields.io/badge/Backend-Express.js-lightgrey)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-green)
![Deployed](https://img.shields.io/badge/Status-Deployed-success)

A comprehensive full-stack web application that revolutionizes the online examination experience. ExamPrep enables educators to create and manage exams efficiently while providing students with an interactive, user-friendly platform to take tests and track their academic progress.

---

## 🌐 Live Deployment

- **Frontend:** [https://exam-prep-beta.vercel.app](https://exam-prep-beta.vercel.app)
- **Backend API:** [https://examprep-huh9.onrender.com](https://examprep-huh9.onrender.com)
- **API Health Check:** [https://examprep-huh9.onrender.com/](https://examprep-huh9.onrender.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment Guide](#-deployment-guide)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👨‍🏫 For Teachers/Educators

- **Exam Creation & Management**
  - Create custom exams with multiple-choice questions
  - Configure exam parameters: duration, difficulty level, passing score, and category
  - Add multiple questions with 4 options each
  - Edit existing exams
  - Delete exams (with confirmation)
- **Dashboard Analytics**
  - View all created exams in a clean grid layout
  - Track number of students who attempted each exam
  - Monitor exam statistics and participation
  - Quick access to exam details

### 👨‍🎓 For Students

- **Exam Taking Experience**

  - Browse all available exams with detailed information
  - Real-time countdown timer with auto-submit on timeout
  - Clean, distraction-free exam interface
  - Question navigation (one at a time)
  - Visual progress tracking
  - Instant score calculation upon submission

- **Performance Analytics**
  - Comprehensive results dashboard with animated score cards
  - Performance statistics: total exams, pass rate, average score
  - Filter results by status (All/Passed/Failed)
  - Sort by date, score, or exam title
  - Detailed result breakdown for each exam:
    - Overall score with animated circular progress
    - Question-by-question analysis
    - Color-coded answers (correct/incorrect/skipped)
    - Performance metrics (accuracy, time spent)
    - Comparison with passing score

### 🔐 Security & Authentication

- **JWT-based Authentication**

  - Secure token generation with 30-day expiration
  - HTTP-only cookies for token storage (prevents XSS attacks)
  - Role-based access control (Teacher/Student)
  - Protected routes with middleware
  - Auto logout on token expiration

- **Cross-Origin Security**
  - Advanced CORS configuration with credentials support
  - Automatic Vercel preview deployment support
  - SameSite cookie attributes for cross-site protection
  - Secure cookies in production with trust proxy

### 🎨 UI/UX Features

- Modern gradient design with smooth animations
- Responsive layout (mobile, tablet, desktop)
- Loading states and error handling
- Toast notifications for user feedback
- Intuitive navigation and user flow
- Color-coded visual feedback

---

## 🛠 Tech Stack

### Frontend

- **React.js** (v18+) - UI library
- **React Router DOM** (v6) - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - State management
- **CSS3** - Styling with animations and gradients

### Backend

- **Node.js** (v18+) - JavaScript runtime
- **Express.js** (v5) - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** (v8) - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie parsing middleware
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Deployment & DevOps

- **Frontend:** Vercel (Continuous Deployment)
- **Backend:** Render (Web Service)
- **Database:** MongoDB Atlas (Cloud Database)
- **Version Control:** Git & GitHub

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                    (React + Vercel)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │  Exams   │  │ Results  │   │
│  │ Register │  │  Teacher │  │  Student │  │  MyRes.  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS + Cookies
                         │ withCredentials: true
┌────────────────────────▼────────────────────────────────────┐
│                      API Gateway Layer                       │
│                   (Express + Render)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CORS Middleware (*.vercel.app + allowlist)          │  │
│  │  Cookie Parser + JSON Parser                         │  │
│  │  Trust Proxy (for secure cookies behind proxy)       │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼─────┐  ┌──────▼─────┐
│ Auth Routes  │  │ Exam Routes│  │Result Routes│
│  /api/auth   │  │ /api/exams │  │/api/results│
└───────┬──────┘  └──────┬─────┘  └──────┬─────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Middleware Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  protect() - JWT verification                        │  │
│  │  teacherOnly() - Role check                          │  │
│  │  studentOnly() - Role check                          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Controller Layer                           │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Auth     │  │     Exam     │  │    Result    │        │
│  │Controllers │  │ Controllers  │  │ Controllers  │        │
│  └────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      Data Layer                              │
│                  (MongoDB Atlas)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   User   │  │   Exam   │  │  Result  │                  │
│  │  Model   │  │  Model   │  │  Model   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Example: Taking an Exam

```
1. Student clicks "Take Exam"
   ↓
2. Frontend sends GET /api/exams/:id (with JWT cookie)
   ↓
3. Backend verifies JWT → calls protect() middleware
   ↓
4. Controller fetches exam (excludes correct answers)
   ↓
5. Student completes exam → submits answers
   ↓
6. Frontend sends POST /api/results/submit
   ↓
7. Backend calculates score, saves Result document
   ↓
8. Returns result with detailed breakdown
   ↓
9. Frontend displays animated result with analytics
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**
- **npm** or **yarn**

### Step 1: Clone the Repository

```bash
git clone https://github.com/naseanishka/ExamPrep.git
cd ExamPrep
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to `server/.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/examprep
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/examprep

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters

# Server Configuration
PORT=3002
NODE_ENV=development

# Frontend URLs (comma-separated for multiple origins)
CLIENT_URL=http://localhost:3000,http://localhost:3001
```

```bash
# Start development server
npm run dev

# Server will run on http://localhost:3002
```

### Step 3: Frontend Setup

Open a new terminal:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
touch .env.local
```

Add the following to `client/.env.local`:

```env
REACT_APP_API_URL=http://localhost:3002/api
```

```bash
# Start React development server
npm start

# App will open on http://localhost:3000
```

### Step 4: Test the Application

1. Open browser at `http://localhost:3000`
2. Register as a teacher: username, email, password, role="teacher"
3. Register as a student: username, email, password, role="student"
4. Create an exam as teacher
5. Take the exam as student
6. View results

---

## 🔑 Environment Variables

### Backend (`server/.env`)

| Variable      | Description                                | Example                                            |
| ------------- | ------------------------------------------ | -------------------------------------------------- |
| `MONGODB_URI` | MongoDB connection string                  | `mongodb://localhost:27017/examprep`               |
| `JWT_SECRET`  | Secret key for JWT signing                 | `your_secret_key_min_32_chars`                     |
| `PORT`        | Server port                                | `3002`                                             |
| `NODE_ENV`    | Environment mode                           | `development` or `production`                      |
| `CLIENT_URL`  | Allowed frontend origins (comma-separated) | `http://localhost:3000,https://yourapp.vercel.app` |

### Frontend (`client/.env.local` or `.env.production`)

| Variable            | Description          | Example                     |
| ------------------- | -------------------- | --------------------------- |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:3002/api` |

---

## 📡 API Documentation

### Base URL

- **Development:** `http://localhost:3002/api`
- **Production:** `https://examprep-huh9.onrender.com/api`

### Authentication Endpoints

#### 1. Register User

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "teacher"
}

Response: 201 Created
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "userName": "johndoe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### 2. Sign In

```http
POST /api/auth/signin
Content-Type: application/json

{
  "userName": "johndoe",
  "password": "password123"
}

Response: 200 OK
Set-Cookie: token=<jwt>; HttpOnly; SameSite=None; Secure
{
  "message": "Sign-in successful",
  "user": {
    "id": "...",
    "name": "John Doe",
    "userName": "johndoe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### 3. Get Current User (Protected)

```http
GET /api/auth/me
Cookie: token=<jwt>

Response: 200 OK
{
  "id": "...",
  "name": "John Doe",
  "userName": "johndoe",
  "email": "john@example.com",
  "role": "student"
}
```

#### 4. Sign Out

```http
POST /api/auth/signout

Response: 200 OK
{
  "message": "Signed out successfully"
}
```

### Exam Endpoints

#### 1. Get All Exams

```http
GET /api/exams
Cookie: token=<jwt>

Response: 200 OK
[
  {
    "_id": "...",
    "title": "JavaScript Basics",
    "description": "Test your JS knowledge",
    "duration": 30,
    "category": "General",
    "difficulty": "Medium",
    "passingScore": 70,
    "questions": [...], // without correct answers
    "createdBy": {
      "name": "Teacher Name",
      "email": "teacher@example.com"
    },
    "createdAt": "2025-10-24T..."
  }
]
```

#### 2. Get Exam by ID

```http
GET /api/exams/:id
Cookie: token=<jwt>

Response: 200 OK
{
  "_id": "...",
  "title": "JavaScript Basics",
  "questions": [
    {
      "questionText": "What is closure?",
      "options": ["A", "B", "C", "D"],
      "marks": 1
      // correctAnswer excluded for students
    }
  ]
}
```

#### 3. Create Exam (Teacher Only)

```http
POST /api/exams
Cookie: token=<jwt>
Content-Type: application/json

{
  "title": "React Fundamentals",
  "description": "Test your React knowledge",
  "duration": 45,
  "category": "General",
  "difficulty": "Medium",
  "passingScore": 70,
  "questions": [
    {
      "questionText": "What is JSX?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "marks": 1
    }
  ]
}

Response: 201 Created
```

#### 4. Get My Created Exams (Teacher Only)

```http
GET /api/exams/my-exams
Cookie: token=<jwt>

Response: 200 OK
[
  {
    "_id": "...",
    "title": "React Fundamentals",
    "attempts": 5, // number of students who took the exam
    ...
  }
]
```

#### 5. Update Exam (Teacher Only)

```http
PUT /api/exams/:id
Cookie: token=<jwt>
Content-Type: application/json

{
  "title": "Updated Title",
  "duration": 60
}

Response: 200 OK
```

#### 6. Delete Exam (Teacher Only)

```http
DELETE /api/exams/:id
Cookie: token=<jwt>

Response: 200 OK
{
  "message": "Exam deleted successfully"
}
```

### Result Endpoints

#### 1. Submit Exam

```http
POST /api/results/submit
Cookie: token=<jwt>
Content-Type: application/json

{
  "examId": "...",
  "answers": [0, 2, 1, 3, 0] // indices of selected options
}

Response: 201 Created
{
  "_id": "...",
  "score": 80,
  "totalMarks": 100,
  "percentage": 80,
  "passed": true,
  "answers": [
    {
      "questionText": "What is JSX?",
      "selectedAnswer": 0,
      "correctAnswer": 0,
      "isCorrect": true,
      "marks": 1
    }
  ]
}
```

#### 2. Get My Results

```http
GET /api/results/my
Cookie: token=<jwt>

Response: 200 OK
[
  {
    "_id": "...",
    "exam": {
      "title": "JavaScript Basics",
      "passingScore": 70
    },
    "score": 85,
    "totalMarks": 100,
    "percentage": 85,
    "passed": true,
    "submittedAt": "2025-10-24T..."
  }
]
```

#### 3. Get Result by ID

```http
GET /api/results/:id
Cookie: token=<jwt>

Response: 200 OK
{
  "_id": "...",
  "exam": { "title": "...", "passingScore": 70 },
  "score": 85,
  "answers": [...]
}
```

#### 4. Get Exam Results (Teacher Only)

```http
GET /api/results/exam/:examId
Cookie: token=<jwt>

Response: 200 OK
[
  {
    "student": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "score": 85,
    "percentage": 85,
    "passed": true,
    "submittedAt": "..."
  }
]
```

---

## 🌍 Deployment Guide

### Backend Deployment (Render)

1. **Create Render Account**

   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `examprep-backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `node index.js`
     - **Branch:** `main`

3. **Add Environment Variables**

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/examprep
   JWT_SECRET=your_production_secret_min_32_characters
   PORT=10000
   NODE_ENV=production
   CLIENT_URL=https://your-app.vercel.app,http://localhost:3000
   ```

4. **Deploy**
   - Render will auto-deploy on every git push
   - Note your backend URL: `https://your-service.onrender.com`

### Frontend Deployment (Vercel)

1. **Create Vercel Account**

   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**

   - Click "New Project"
   - Import your GitHub repository
   - **Root Directory:** `client`
   - **Framework Preset:** Create React App

3. **Add Environment Variable**

   ```
   REACT_APP_API_URL=https://your-render-service.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be live at `https://your-project.vercel.app`

### MongoDB Atlas Setup

1. **Create Atlas Account**

   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**

   - Create new cluster (free M0)
   - Choose cloud provider and region
   - Cluster name: `ExamPrep`

3. **Configure Access**

   - Database Access: Create user with password
   - Network Access: Add IP `0.0.0.0/0` (allow from anywhere)

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Use this in `MONGODB_URI` environment variable

---

## 📁 Project Structure

```
ExamPrep/
├── client/                      # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js         # Login form component
│   │   │   │   └── Register.js      # Registration form
│   │   │   ├── dashboard/
│   │   │   │   ├── StudentDashboard.js  # Student home
│   │   │   │   └── TeacherDashboard.js  # Teacher home
│   │   │   ├── exams/
│   │   │   │   ├── CreateExam.js    # Exam creation wizard
│   │   │   │   ├── ExamDetail.js    # Exam info page
│   │   │   │   ├── ExamList.js      # Browse exams
│   │   │   │   ├── TakeExam.js      # Exam taking interface
│   │   │   │   └── ExamResult.js    # Result display
│   │   │   └── results/
│   │   │       ├── MyResults.js     # Results list with filters
│   │   │       └── ResultDetail.js  # Detailed result breakdown
│   │   ├── context/
│   │   │   └── AuthContext.js       # Auth state management
│   │   ├── services/
│   │   │   └── api.js               # Axios instance & API calls
│   │   ├── styles/                  # CSS files
│   │   ├── App.js                   # Main app component
│   │   ├── App.css
│   │   ├── index.js                 # React entry point
│   │   └── index.css
│   ├── package.json
│   └── README.md
│
├── server/                      # Node.js backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── token.js                 # JWT token generator
│   ├── controllers/
│   │   ├── auth.controllers.js      # Auth logic
│   │   ├── exam.controllers.js      # Exam CRUD
│   │   └── result.controllers.js    # Result submission & retrieval
│   ├── middleware/
│   │   └── auth.middleware.js       # JWT verification & role checks
│   ├── models/
│   │   ├── user.model.js            # User schema
│   │   ├── exam.model.js            # Exam schema
│   │   └── result.model.js          # Result schema
│   ├── routes/
│   │   ├── auth.routes.js           # /api/auth routes
│   │   ├── exam.routes.js           # /api/exams routes
│   │   └── result.routes.js         # /api/results routes
│   ├── scripts/
│   │   └── createTestExam.js        # Sample data generator
│   ├── index.js                     # Express app entry
│   ├── package.json
│   └── .env.example
│
└── README.md                    # This file
```

---

## 📸 Screenshots

### Login Page

```
┌────────────────────────────────────────┐
│         ExamPrep Logo                  │
│                                        │
│    ┌──────────────────────────────┐   │
│    │ Username: ____________       │   │
│    │ Password: ____________       │   │
│    │                              │   │
│    │      [  Login  ]             │   │
│    │                              │   │
│    │   Don't have account?        │   │
│    │   Register here              │   │
│    └──────────────────────────────┘   │
└────────────────────────────────────────┘
```

### Teacher Dashboard

```
┌────────────────────────────────────────┐
│  Welcome, Teacher Name!                │
│  [Create New Exam] [Logout]            │
├────────────────────────────────────────┤
│  My Created Exams                      │
│                                        │
│  ┌──────────┐  ┌──────────┐           │
│  │ JS Basic │  │ React    │           │
│  │ 15 tries │  │ 8 tries  │           │
│  │[Edit][Del]  │[Edit][Del]           │
│  └──────────┘  └──────────┘           │
└────────────────────────────────────────┘
```

### Student Dashboard

```
┌────────────────────────────────────────┐
│  Welcome, Student Name!                │
│  [My Results] [Logout]                 │
├────────────────────────────────────────┤
│  Available Exams                       │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ JavaScript Basics              │   │
│  │ Duration: 30 min | Medium      │   │
│  │ Passing: 70%                   │   │
│  │          [Take Exam]           │   │
│  └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### Exam Taking Interface

```
┌────────────────────────────────────────┐
│  JavaScript Basics    ⏰ 28:45         │
│  Question 3 of 10                      │
├────────────────────────────────────────┤
│  What is a closure in JavaScript?     │
│                                        │
│  ○ A. A function inside function      │
│  ○ B. A loop statement                │
│  ○ C. An array method                 │
│  ○ D. A variable type                 │
│                                        │
│         [Next Question]                │
└────────────────────────────────────────┘
```

### Results Dashboard

```
┌────────────────────────────────────────┐
│  My Performance                        │
│  ┌──────┐ ┌──────┐ ┌──────┐           │
│  │Total │ │Pass  │ │Avg   │           │
│  │  5   │ │ 80%  │ │ 85%  │           │
│  └──────┘ └──────┘ └──────┘           │
├────────────────────────────────────────┤
│  Filter: [All] [Passed] [Failed]      │
│  Sort: [Date] [Score]                  │
│                                        │
│  ┌────────────────────────────────┐   │
│  │ JS Basics        Score: 85%    │   │
│  │ Oct 24, 2025    [View Detail]  │   │
│  └────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### Detailed Result View

```
┌────────────────────────────────────────┐
│          JavaScript Basics             │
│                                        │
│            ╭─────────╮                 │
│            │   85%   │  ← Animated    │
│            ╰─────────╯                 │
│                                        │
│  Score: 85/100 | Passing: 70%         │
│  Status: ✅ PASSED                     │
├────────────────────────────────────────┤
│  Performance Breakdown                 │
│  Correct:   17/20  ████████░░          │
│  Incorrect:  2/20  ██░░░░░░░░          │
│  Skipped:    1/20  █░░░░░░░░░          │
├────────────────────────────────────────┤
│  Q1. What is closure?                  │
│  Your Answer: A ✅ Correct             │
│                                        │
│  Q2. Explain hoisting                  │
│  Your Answer: C ❌ Incorrect           │
│  Correct Answer: B                     │
└────────────────────────────────────────┘
```

---

## 🚀 Future Enhancements

### Phase 1 (High Priority)

- [ ] **Question Bank Management** - Create reusable question library
- [ ] **Bulk Question Import** - CSV/Excel import for questions
- [ ] **Exam Analytics for Teachers** - Average scores, question difficulty analysis
- [ ] **Email Notifications** - Exam invitations and result notifications
- [ ] **Profile Management** - Edit user profile, change password
- [ ] **Exam Scheduling** - Set start and end times for exams

### Phase 2 (Medium Priority)

- [ ] **Multiple Question Types** - True/False, Multiple Select, Essay
- [ ] **Image Support** - Add images to questions
- [ ] **Rich Text Editor** - Formatted questions with code snippets
- [ ] **Exam Categories** - Organize by subject, topic, difficulty
- [ ] **Student Progress Tracking** - Track improvement over time
- [ ] **Leaderboards** - Top performers per exam/category
- [ ] **Certificate Generation** - PDF certificates for passed exams

### Phase 3 (Advanced Features)

- [ ] **Live Proctoring** - Webcam monitoring during exams
- [ ] **Randomized Questions** - Shuffle questions per student
- [ ] **Partial Grading** - Award partial marks for close answers
- [ ] **Peer Review** - Students review each other's essay answers
- [ ] **Mobile App** - React Native iOS/Android app
- [ ] **Payment Integration** - Premium exams with Stripe
- [ ] **AI-Generated Questions** - Use OpenAI to create questions
- [ ] **Video Explanations** - Add video explanations for answers

### Technical Improvements

- [ ] **WebSocket Integration** - Real-time exam updates
- [ ] **Redis Caching** - Cache frequently accessed data
- [ ] **Rate Limiting** - Prevent API abuse
- [ ] **Input Sanitization** - Enhanced XSS protection
- [ ] **API Rate Limiting** - Throttle requests per user
- [ ] **Comprehensive Testing** - Jest + React Testing Library
- [ ] **CI/CD Pipeline** - GitHub Actions for automated testing
- [ ] **Docker Containerization** - Easy local development setup
- [ ] **GraphQL API** - Alternative to REST
- [ ] **TypeScript Migration** - Type safety across codebase

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check if the bug is already reported in [Issues](https://github.com/naseanishka/ExamPrep/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Open an issue with tag `enhancement`
2. Describe the feature and use case
3. Explain why it's beneficial

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test your changes locally
- Update documentation if needed
- Keep commits atomic and descriptive

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 ExamPrep

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Author

**Anish Kanase**

- GitHub: [@naseanishka](https://github.com/naseanishka)
- Project Repository: [ExamPrep](https://github.com/naseanishka/ExamPrep)

---

## 🙏 Acknowledgments

- React documentation and community
- Express.js team
- MongoDB Atlas for free tier
- Vercel & Render for hosting
- All open-source contributors

---

## 📧 Support

If you have questions or need help:

1. Check the [API Documentation](#-api-documentation)
2. Review [Installation Guide](#-installation--setup)
3. Search [existing issues](https://github.com/naseanishka/ExamPrep/issues)
4. Create a new issue if needed

---

## ⭐ Show Your Support

If you find this project helpful:

- ⭐ Star the repository
- 🍴 Fork and contribute
- 📢 Share with others
- 🐛 Report bugs
- 💡 Suggest features

---

<div align="center">

**Made with ❤️ by Anish Kanase**

[⬆ Back to Top](#-examprep---online-examination-management-system)

</div>
