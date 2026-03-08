# MERN Stack Note Taking Web App

A full-stack MERN application for collaborative note-taking with rich
text editing and real-time search.

## Features

-   User authentication (JWT, bcrypt)
-   Create, edit, delete notes
-   Rich text editor (React Quill)
-   Add/remove collaborators by email
-   Full-text search on notes
-   Owner-only deletion
-   Responsive Tailwind CSS UI
-   Toast notifications

## Tech Stack

-   **MongoDB** + Mongoose
-   **Express.js**
-   **React.js** (Vite)
-   **Node.js**
-   **Tailwind CSS**
-   **JWT** for authentication

## Getting Started

### Prerequisites

-   Node.js (v16+)
-   MongoDB (local or Atlas)

### Installation

1.  Clone the repository

``` bash
git clone https://github.com/Samitha-Edirisinghe/MERN-Stack-Note-Taking-Web-App.git
cd collabo-notes
```

2.  Install backend dependencies

``` bash
cd backend
npm install
```

3.  Set up environment variables in `backend/.env` (see `.env.example`)

4.  Install frontend dependencies

``` bash
cd ../frontend
npm install
```

5.  Start MongoDB (if running locally)

6.  Run the backend

``` bash
cd backend
npm run dev
```

7.  Run the frontend

``` bash
cd frontend
npm run dev
```

8.  Open

```{=html}
<!-- -->
```
    http://localhost:5173

## Environment Variables

### Backend `.env`

    MONGO_URI=mongodb://localhost:27017/collabo-notes
    JWT_SECRET=your_jwt_secret
    PORT=5000

### Frontend `.env` (optional)

    VITE_API_URL=http://localhost:5000/api

## API Endpoints

### Auth

-   `POST /api/auth/register` -- Register user
-   `POST /api/auth/login` -- Login user
-   `GET /api/auth/me` -- Get current user (protected)

### Notes

-   `GET /api/notes` -- Get all accessible notes
-   `GET /api/notes/search?q=query` -- Search notes
-   `GET /api/notes/:id` -- Get single note
-   `POST /api/notes` -- Create note
-   `PUT /api/notes/:id` -- Update note
-   `DELETE /api/notes/:id` -- Delete note (owner only)
-   `PUT /api/notes/:id/collaborators/add` -- Add collaborator
-   `PUT /api/notes/:id/collaborators/remove` -- Remove collaborator

### Users

-   `GET /api/users` -- Get all users (for collaboration)

## Folder Structure

MERN Stack Note Taking Web App/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── noteController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   └── userRoutes.js
│   └── utils/
│       └── generateToken.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── assets/
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Loader.jsx
│       │   ├── NoteCard.jsx
│       │   ├── SearchBar.jsx
│       │   ├── CollaboratorModal.jsx
│       │   └── Toast.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   └── useAuth.js
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── NoteEditor.jsx
│       │   └── NotFound.jsx
│       ├── routes/
│       │   └── PrivateRoute.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   └── noteService.js
│       └── utils/
│           └── constants.js
└── README.md
