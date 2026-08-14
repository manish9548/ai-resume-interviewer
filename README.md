# 🤖 AI Resume Interviewer

An AI-powered web application that helps candidates prepare for technical interviews by analyzing their resume and generating personalized interview questions.

The platform uses **AI + Resume Analysis + JWT Authentication + Spring Boot + React** to provide a personalized mock interview experience based on a candidate's skills, projects, education, and experience.

---

## 🚀 Live Demo

🌐 **[AI Resume Interviewer](https://ai-resume-interviewer.vercel.app/)**

Try the deployed application:

**https://ai-resume-interviewer.vercel.app/**

---

## 📌 Overview

Preparing for interviews using generic questions is often not enough.

**AI Resume Interviewer** solves this problem by using the candidate's own resume to generate relevant interview questions.

Instead of asking the same questions to every candidate, the application can focus on the candidate's:

* Technical Skills
* Projects
* Programming Languages
* Education
* Experience
* Technologies mentioned in the resume

The goal is to provide a more realistic and personalized interview preparation experience.

---

## ✨ Features

### 🔐 User Authentication

* User registration and login
* JWT-based authentication
* Secure authentication flow
* Protected backend APIs
* User-specific application data

### 📄 Resume Upload

Users can upload their resume through the application.

The uploaded resume is processed by the backend and used as a source of information for generating personalized interview questions.

### 🤖 AI-Powered Interview

The application uses Generative AI to create interview questions based on the candidate's resume.

Questions can focus on:

* Java
* Spring Boot
* React
* SQL
* Data Structures & Algorithms
* Projects
* Technical Skills
* Previous Experience
* Technologies mentioned in the resume

### 🎯 Personalized Questions

Instead of using a fixed question bank, questions can be generated according to the information available in the candidate's resume.

For example:

> If a candidate mentions a Spring Boot project, the AI can ask questions related to that project's architecture, APIs, database design, authentication, and implementation.

### 💬 Interactive Interview

The candidate can interact with the generated interview questions and practice answering them just like a real interview.

### 📊 Interview Feedback

The AI can evaluate answers and provide useful feedback to help candidates identify areas where they need improvement.

---

# 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       USER           │
                         │                      │
                         │  Register / Login    │
                         │  Upload Resume       │
                         │  Give Interview     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      React.js        │
                         │      Frontend        │
                         │                      │
                         │      Vercel          │
                         └──────────┬───────────┘
                                    │
                               REST APIs
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Spring Boot      │
                         │       Backend       │
                         │                      │
                         │  REST Controllers   │
                         │  Services            │
                         │  JWT Security        │
                         │  Resume Processing   │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └──────────────┐
                    ▼                                   ▼
          ┌──────────────────┐                ┌──────────────────┐
          │      MySQL       │                │    Generative    │
          │     Database     │                │       AI         │
          └──────────────────┘                └──────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* REST API Integration

## Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* REST APIs
* JWT Authentication

## Database

* MySQL

## AI

* Generative AI API
* AI-powered interview question generation
* AI-based response evaluation

## Development Tools

* Git
* GitHub
* IntelliJ IDEA
* VS Code
* Postman
* Maven

## Deployment

* Frontend: Vercel
* Backend: Render

---

# 📂 Project Structure

```text
AI-Resume-Interviewer/
│
├── backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔄 Application Workflow

```text
                  ┌───────────────┐
                  │     User      │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │    Register   │
                  │    / Login    │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │  JWT Token    │
                  │   Generated   │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Upload Resume │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Resume        │
                  │ Processing    │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ AI analyzes   │
                  │ resume data   │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Personalized  │
                  │ Questions     │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Candidate     │
                  │ Answers       │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ AI Evaluation │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Feedback &    │
                  │ Improvement   │
                  └───────────────┘
```

---

# 🔐 Authentication

The application uses **JWT (JSON Web Token)** based authentication.

### Authentication Flow

```text
User
 │
 ├── Register
 │
 ▼
Login
 │
 ▼
Spring Security
 │
 ▼
JWT Token
 │
 ▼
Frontend stores token
 │
 ▼
Token sent with protected API requests
 │
 ▼
Backend validates JWT
 │
 ▼
Authorized Request
```

Example authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📄 Resume Processing

The resume upload system allows users to provide their resume to the application.

The backend receives the uploaded file and processes it so that relevant information can be used for the AI interview.

Important information can include:

```text
Resume
  │
  ├── Skills
  ├── Projects
  ├── Education
  ├── Experience
  ├── Technologies
  └── Other relevant information
          │
          ▼
       AI Prompt
          │
          ▼
 Personalized Interview
```

---

# 🤖 AI Interview Generation

The AI receives relevant resume information and generates interview questions accordingly.

For example, if the resume contains:

```text
Project:
AI Resume Interviewer

Technology:
Java
Spring Boot
MySQL
React
JWT
```

The AI can generate questions such as:

```text
1. Why did you choose Spring Boot for this project?

2. How did you implement authentication?

3. How does JWT authentication work in your application?

4. How did you design the database?

5. How does the frontend communicate with the backend?

6. How would you scale this application?
```

This makes the interview experience more relevant to the candidate.

---

# 🔌 Backend API

The backend exposes REST APIs for different application features.

Typical API modules include:

```text
/api/auth
/api/resume
/api/interview
```

### Authentication APIs

```http
POST /api/auth/register
POST /api/auth/login
```

### Resume APIs

```http
POST /api/resume/upload
```

Additional endpoints may be added as the project evolves.

---

# ⚙️ Local Setup

## Prerequisites

Make sure the following are installed:

* Java 17+
* Maven
* Node.js
* npm
* MySQL
* Git

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-interviewer.git

cd ai-resume-interviewer
```

---

# 2️⃣ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure your database and application properties.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ai_resume_interviewer
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

jwt.secret=YOUR_JWT_SECRET
jwt.expiration=86400000

# AI configuration
ai.api.key=YOUR_AI_API_KEY
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend will run on:

```text
http://localhost:8080
```

---

# 3️⃣ Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

Never commit sensitive credentials to GitHub.

Keep values such as:

```text
Database Password
JWT Secret
AI API Key
```

inside environment-specific configuration.

Example:

```env
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secret
AI_API_KEY=your_api_key
```

Add sensitive files to `.gitignore`:

```text
.env
application-local.properties
```

---

# 🧪 API Testing

Backend APIs can be tested using **Postman**.

Example authentication flow:

```text
Register
   ↓
Login
   ↓
Receive JWT
   ↓
Add JWT to Authorization Header
   ↓
Call Protected APIs
```

---

# 📸 Screenshots

Add screenshots of the application here to make the GitHub repository more attractive.

Example:

```markdown
## 📸 Screenshots

### Login

![Login](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Resume Upload

![Resume Upload](screenshots/resume-upload.png)

### AI Interview

![AI Interview](screenshots/interview.png)
```

---

# 🎯 Use Cases

AI Resume Interviewer can be useful for:

* 🎓 College students
* 👨‍💻 Freshers
* 💼 Job seekers
* 🔄 Developers preparing for job switches
* 🧑‍💼 Candidates preparing for technical interviews
* 📄 Candidates wanting resume-based interview practice

---

# 🚧 Future Improvements

The project can be further enhanced with:

### 🎙️ Voice Interview

Allow the AI interviewer to ask questions using voice.

### 🗣️ Speech Analysis

Analyze:

* Speaking clarity
* Confidence
* Filler words
* Speaking speed

### 💻 Coding Interview

Add an online coding environment where candidates can solve programming questions.

### 📊 Performance Dashboard

Track:

```text
Interview Score
Technical Score
Communication Score
Weak Topics
Strong Topics
Interview History
```

### 🎯 Job Description Based Interview

Allow users to upload a job description and generate questions based on:

```text
Resume + Job Description
          ↓
Personalized Interview
```

### 🧠 Adaptive Difficulty

Automatically increase or decrease interview difficulty based on the candidate's performance.

---

# 💡 What I Learned

Building this project helped me understand and implement:

* Spring Boot application development
* REST API design
* Spring Security
* JWT authentication
* Authentication & authorization
* Hibernate/JPA
* MySQL integration
* File upload APIs
* Frontend-backend integration
* Generative AI API integration
* API testing with Postman
* Git & GitHub
* Deployment of full-stack applications

---

# 🌐 Deployment

The application is deployed using a separate frontend and backend architecture.

```text
Frontend
React + Vite
      │
      ▼
   Vercel
      │
      │ REST API
      ▼
Spring Boot Backend
      │
      ├── MySQL
      │
      └── Generative AI
```

### Live Application

🚀 **[Open AI Resume Interviewer](https://ai-resume-interviewer.vercel.app/)**

---

# 🔒 Security

For production deployments:

* Never expose API keys in frontend code.
* Never commit database credentials.
* Never commit JWT secrets.
* Use environment variables for sensitive configuration.
* Validate uploaded files.
* Protect private APIs using authentication and authorization.

---

# ⭐ Why This Project?

Traditional interview preparation platforms provide generic questions.

**AI Resume Interviewer takes a different approach:**

```text
Traditional Interview Prep
          │
          ▼
   Generic Questions
          │
          ▼
      Same Experience
```

Whereas:

```text
AI Resume Interviewer
          │
          ▼
     Candidate Resume
          │
          ▼
    Resume Analysis
          │
          ▼
 Personalized Questions
          │
          ▼
   Interactive Interview
          │
          ▼
   AI-Based Feedback
```

The goal is to make interview preparation **more personalized, interactive, and practical**.

---

# 👨‍💻 Author

## Manish Baghel

**B.Tech Computer Science**

Interested in:

* Java
* Spring Boot
* React
* Backend Development
* Full Stack Development
* AI-powered Applications

---

## ⭐ Show Your Support

If you found this project interesting, consider giving the repository a ⭐.

Your feedback and suggestions are always welcome!

---

<p align="center">
  Built with ❤️ using Java, Spring Boot, React & AI
</p>
