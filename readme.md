# 🧠 Task Management Application (MERN Stack)

A full-stack **Task Management Web Application** built using the **MERN stack** with a modern, responsive, and visually clean UI powered by **Material UI (MUI)**.  


---

## ✨ Features

### 🔐 Authentication
- JWT-based **Sign Up** and **Sign In** system.
- **Form validation** for email, password, and role selection.
- Automatically redirects to the **Dashboard** after successful login or signup.
- **Form fields clear** automatically after success to prevent stale data.
- Auth state is stored in `localStorage` and persists across sessions.

### 👥 User Roles
- Two roles: **Admin** and **User**.
- **Admin**: Add, edit, and delete tasks.
- **User**: Add and edit tasks only (delete button hidden).
- Role restrictions also enforced on the backend for security.

### 🧾 Task Management
- Users can **Create**, **View**, **Edit**, and (if Admin) **Delete** tasks.
- Each task includes:
  - **Title** (3–12 characters)
  - **Description** (10–150 characters)
  - **Status** (`Pending` / `Completed`)
  - **Created Date**
- Form-level validation ensures proper length and required fields.
- **Status color-coded** for clarity:
  - 🟥 Pending → Red  
  - 🟩 Completed → Green
- **Pagination** for task lists.

### 💅 Frontend UI
- Built using **React.js** + **Material UI (MUI)**.
- Fully **responsive** design:
  - Desktop → Table layout.
  - Mobile/Tablet → Card layout.
- Cards maintain **equal size** with text truncation using ellipsis (`...`).
- Full task content viewable via “View” modal.
- Clean, minimalistic theme with subtle shadows and typography.

### 🌗 Theme Support
- Built-in **Light/Dark mode** with one-click toggle.
- Theme preference stored locally and persisted across reloads.
- Styled with dynamic MUI theme palettes.

### 🔒 Protected Routing
- **ProtectedRoute** ensures only logged-in users can access the dashboard.
- Logged-in users are redirected away from Sign In / Sign Up pages.
- Logout clears tokens and user info from localStorage.

---

## 🛠 Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | React.js, Material UI, Axios, React Router DOM |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB (Atlas) |
| **Auth** | JSON Web Tokens (JWT) |
| **Styling** | MUI Theming (Light/Dark) |

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/TaskManagementApplication.git
   cd TaskManagementApplication

2. **Install dependencies**
   ```bash
   npm run install:all

3. **Setup environment variables**
   ```bash
   #Backend
    PORT=5001
    MONGO_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret

    #Frontend
    REACT_APP_API_URL=http://localhost:5001/api

4. **Run the development servers**
   ```bash
   npm run start