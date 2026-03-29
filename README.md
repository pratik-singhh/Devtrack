# 📄 TaskMaster — Fullstack "Old Paper" Task Manager

> A high-performance, fullstack task management application with a unique "Vintage Document" aesthetic.

![Old Paper Theme Preview](https://raw.githubusercontent.com/pratik-singhh/Devtrack/main/frontend/src/assets/paper_texture.png)

## ✨ The Vision
**TaskMaster** is not just another To-Do list. It's a digital workspace designed to feel like a physical filing cabinet. Inspired by vintage bureaucratic documents and classic typewriters, it provides a focused, distraction-free environment for organizing your life.

---

## 🌐 Live Demo

- **Frontend:** [taskmaster-rho-two.vercel.app](https://taskmaster-rho-two.vercel.app/)

---

## 🎨 Design Philosophy: "Old Paper"
TaskMaster moves away from modern neon/glassmorphism trends to embrace a **Vintage Document** look:
- **Paper Palette**: Warm cream/sepia background (`#F4EBD0`) with rich ink-black text.
- **Typography**: Uses **Courier Prime** for an authentic typewriter feel.
- **Parchment UI**: Every project is a "Record," and every task is a "Sub-Record" stamped into the history.
- **Zero Distractions**: No complex animations, just the sound of (imaginary) ink on paper.

---

## 🚀 Core Features

- 🔐 **Secure Access (JWT)**
  - Full authentication flow (Signup/Login).
  - Encrypted passwords using `bcrypt`.
  - Token-based persistent sessions.

- 📁 **Filing Cabinet (Projects)**
  - Group related tasks into isolated "Project Records."
  - Complete CRUD operations (Create, Edit, Delete).
  - Infinite scrollable list of historical records.

- ✅ **Ledger Management (Tasks)**
  - Add specific tasks to any project.
  - Interactive "Ink-stamped" checkboxes.
  - Real-time UI updates (Optimistic UI).

- 🔒 **Data Privacy**
  - Strict user-based isolation.
  - You only see your own records; they are strictly confidential.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL (Neon) |
| **Styling** | Custom CSS (Paper Design System) |
| **Hosting** | Vercel (Frontend), Railway (Backend) |

---

## 🛠️ Local Installation

### 1. Clone the Repository
```bash
git clone https://github.com/pratik-singhh/Devtrack.git
cd Devtrack
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# DATABASE_URL=your_postgres_url
# JWT_SECRET=your_secret
node server.js
```

---

## 🗄️ Database Schema
The system operates on a relational model optimized for speed:
- **Users**: Identity records.
- **Projects**: Group containers owned by users.
- **Tasks**: Individual units of work linked to projects.

---

## 📜 License
This project is licensed under the **MIT License**.

---

*Hand-crafted with ❤️ by [Pratik Singh](https://github.com/pratik-singhh)*
