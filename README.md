# ⚡ AetherPulse OS — AI Emergency Healthcare Platform

**An AI-powered healthcare platform designed to support rapid emergency response, smart health monitoring, and intelligent healthcare assistance using modern web technologies.**

## 🌟 Overview

AetherPulse OS is a full-stack web application built to provide a modern foundation for emergency healthcare services. It combines a responsive React frontend with a Node.js and Express.js backend, MongoDB database integration, and secure user authentication.

The project focuses on creating a user-friendly healthcare experience with a scalable architecture for future AI-powered healthcare features.

## ✨ Key Features

- 🏥 **Healthcare Dashboard** — Modern interface for healthcare-related information.
- 🔐 **User Authentication** — Registration and login with password hashing and JWT-based authentication.
- 🔄 **REST API Integration** — Backend endpoints for communication between frontend and server.
- 🗄️ **Database Integration** — MongoDB with Mongoose for data management.
- 📱 **Responsive UI** — Clean interface designed for a better user experience.
- 🚀 **Scalable Architecture** — Backend structure ready for additional healthcare modules.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Vite

### Backend
- Node.js
- Express.js
- REST APIs
- JSON Web Token (JWT)
- bcryptjs

### Database
- MongoDB
- Mongoose

### Development Tools
- Visual Studio Code
- Git & GitHub
- npm
- Postman
- MongoDB Compass

## 🏗️ Project Architecture

```text
AetherPulseOS/
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── App.jsx
├── App.css
├── Dashboard.jsx
├── Features.jsx
├── Footer.jsx
├── Hero.jsx
├── Home.jsx
├── Navbar.jsx
├── index.css
├── index.html
├── main.jsx
├── package.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Community Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/732523AD016/AetherPulseOs.git
cd AetherPulseOs
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/aetherpulse
JWT_SECRET=your_secure_random_secret
```

Replace the JWT placeholder with a newly generated, strong secret. Never upload `.env` to GitHub.

### 4. Start the Backend

From the `backend` folder:

```bash
node server.js
```

Backend health check:

`http://localhost:5000/api/health`

### 5. Start the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

`http://localhost:5173`

## 🔐 Security

- Passwords are hashed using bcryptjs.
- JWT is used for authentication.
- Environment variables are used for sensitive configuration.
- `.env` files should remain excluded from version control.

## 🎯 Project Goals

- Build a modern full-stack healthcare application.
- Integrate frontend components with backend REST APIs.
- Implement secure user registration and login.
- Establish a foundation for future AI-assisted healthcare features.

## 🚀 Future Enhancements

- AI-assisted healthcare guidance.
- Real-time emergency alerts and notifications.
- Smart health monitoring dashboard.
- Location-based emergency service discovery.
- Doctor and patient management modules.

*These are planned enhancements and should not be considered implemented unless added to the application.*

## 👩‍💻 Developer

**Hema Periyasamy**

B.Tech — Artificial Intelligence and Data Science

Interested in Full Stack Development, AI-powered applications, and building practical solutions using modern web technologies.

---

⭐ If you find this project interesting, consider giving the repository a star!

**Built with ❤️ using the MERN Stack**
