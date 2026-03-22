# 🧠 DevTrack — Fullstack Task Manager

A fullstack task management app with authentication, project organization, and task tracking.  
Built to simulate real-world workflows with secure user-based access and deployed infrastructure.

---

## 🌐 Live Demo

- **Frontend:** https://taskmaster-rho-two.vercel.app/
- **Backend API:** https://devtrack-production.up.railway.app  

---

## 🚀 Features

- 🔐 **Authentication (JWT)**
  - User signup & login
  - Secure token-based access

- 📁 **Project Management**
  - Create, edit, delete projects
  - Each user has isolated data

- ✅ **Task Management**
  - Add tasks to projects
  - Toggle completion
  - Update task details
  - Delete tasks

- 🔒 **Authorization**
  - Users can only access their own projects & tasks
  - Protected backend routes

- ⚡ **Real-time UI Updates**
  - Optimistic updates for better UX
  - Instant feedback on actions

---

## 🧱 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- PostgreSQL

### Auth
- JSON Web Tokens (JWT)
- bcrypt

### Deployment
- Frontend: Vercel
- Backend: Railway
- Database: Neon (PostgreSQL)

---

## 🗄️ Database Schema

```sql
users
- id
- email
- password

projects
- id
- name
- user_id

tasks
- id
- name
- project_id
- completed
- created_at
