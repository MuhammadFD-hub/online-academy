# Online Academy

This is a learning project I built to explore and practice React.js. It’s an online course platform where users can:

- Sign up and log in
- Enroll in courses
- Read lessons
- Track their progress

## Table of Contents

- [Online Academy](#online-academy)
  - [Table of Contents](#table-of-contents)
  - [Intro](#intro)
  - [How to use](#how-to-use)
  - [Learning Process](#learning-process)
  - [Backend Overview](#backend-overview)
    - [Database (MongoDB)](#database-mongodb)
      - [User](#user)
      - [Course](#course)
      - [Lesson](#lesson)
      - [UserProgress](#userprogress)
    - [Express.js](#expressjs)
      - [Routes Overview](#routes-overview)
      - [Auth Routes](#auth-routes)
      - [Course Routes](#course-routes)
      - [Lesson Routes](#lesson-routes)
      - [User Routes](#user-routes)
  - [Frontend](#frontend)
    - [Main Libraries](#main-libraries)
    - [Architecture \& Data Flow](#architecture--data-flow)
      - [`/components/`](#components)
      - [`/stores/`](#stores)
        - [Store Slices](#store-slices)
    - [Authentication \& Fetch Handling](#authentication--fetch-handling)
    - [Styling](#styling)
  - [License](#license)

## Intro

The project is built using the **MERN stack** (MongoDB, Express, React, Node.js). I created this project to understand how the frontend, backend, and database work together in a full-stack web application. Through this project, I learned how to:

- Use **React.js** for building dynamic UIs
- Connect frontend to a backend API
- Manage user authentication and course data
- Work with MongoDB and Mongoose

**Tech Stack:** React, Express.js, Node.js, MongoDB, Mongoose, Zustand, Bootstrap, Vite

## How to use

- Download provided files
- The backend and frontend folders don’t include node_modules.
- Run npm install in each folder to install dependencies.
- Run the backend:

```bash
node server.js
```

- Run the frontend (Vite):

```bash
npm run dev
```

- to reset backend run 'npm run seed' in backend

**When using project dont add any sensitive information on it.**

## Learning Process

While building this, I used **ChatGPT** for help whenever I was stuck or faced multiple implementation options. Although the backend code and some parts of the UI (e.g., Bootstrap styling) were generated with AI help, I fully understand how the app works and can explain each part of it.

## Backend Overview

Built with **Express.js**, **MongoDB**, and **Mongoose**, this backend handles user authentication, course management, lessons, and progress tracking for the web app.

---

### Database (MongoDB)

The database uses Mongoose models for the following collections:

1. **User**
2. **Course**
3. **Lesson**
4. **UserProgress**

#### User

Stores user credentials and profile data.

- `email`, `password`
- `profilePic`, `backgroundPic`
- `settings`, `userInfo` (name, date of birth, gender)
- `timestamps`

#### Course

Represents a single course and its related lessons.

- `title`, `description`
- `lessons` _(array of Lesson IDs)_

Each course references all its lessons by ID.

#### Lesson

Stores individual lesson content.

- `title`, `content` _(Markdown text)_
- `course` _(Course ID)_
- `order` _(Lesson position in course)_

#### UserProgress

Tracks a user’s progress in enrolled courses.

- `user` _(User ID)_
- `course` _(Course ID)_
- `readLessons` _(array of Lesson IDs)_

Each record corresponds to one user-course enrollment.

---

### Express.js

All routes (except authentication) use **JWT-based authentication**, verified by a middleware (`authToken.js`).  
A long-term token is stored in cookies; if verification fails, the user is logged out automatically.

#### Routes Overview

1. **Auth Routes**
2. **Course Routes**
3. **Lesson Routes**
4. **User Routes**

---

#### Auth Routes

- `POST /signup` – Validates credentials, hashes password, creates user, returns JWT
- `POST /login` – Authenticates user and returns JWT
- `POST /refresh` – Refreshes long-term cookie token
- `POST /logout` – Clears stored token

---

#### Course Routes

- `GET /` – Returns all courses with user’s enrollment status
- `POST /enroll` – Enrolls user in a course by ID
- `GET /:courseId/lessons` – Returns ordered lessons (titles only) for a course
- `GET /:courseId` – Returns course details with enrollment status

---

#### Lesson Routes

- `GET /:lessonId` – Returns lesson content by ID
- `POST /mark-read` – Adds lesson ID to user’s read lessons in progress tracking

---

#### User Routes

Provide access to user profile, preferences, and progress data.

- `/dashboard` – Returns enrolled courses count and progress percentages
- `/uploadPfp`, `/getPfp` – Manage profile picture
- `/uploadBg`, `/getBg` – Manage background picture
- `/updateEmail`, `/updatePassword` – Account management
- `/getUserInfo`, `/uploadUserInfo` – Manage name, DoB, gender
- `/getBgFocus`, `/updateBgFocus` – Background focus position (top/mid/bottom)
- `/getUser` – Returns basic profile data (email, profile picture)

---

## Frontend

Built with **React**, styled using **Bootstrap**, **CSS Modules**, and inline CSS.
Includes smooth animations, markdown rendering, and efficient state management via **Zustand**.

---

### Main Libraries

- **bootstrap**, **react-bootstrap** – UI components & styling
- **framer-motion** – Animations
- **highlight.js** – Code syntax highlighting
- **jwt-decode** – Token decoding
- **react**, **react-dom**, **react-router-dom** – Core React libraries and routing
- **react-easy-crop** – Profile image cropping
- **react-icons** – Icons
- **react-markdown** – Markdown rendering with:

  - `remark-gfm` (GitHub Flavored Markdown)
  - `rehype-raw`, `rehype-sanitize` (HTML parsing & safety)
  - `rehype-slug`, `rehype-highlight` (IDs for headings, syntax highlighting)

- **zustand** – Lightweight global state management

---

### Architecture & Data Flow

The frontend follows a modular folder structure:

#### `/components/`

- Contains reusable UI elements (e.g., buttons, header, spinner).
- Also includes a `pages/` subfolder for top-level views.
- Components follow a clear hierarchy — if Component A is used only inside B, it resides within B’s folder.

#### `/stores/`

- Contains all **Zustand store slices**, later merged in `UserStore.jsx`.
- Each slice manages a separate domain of app state.

##### Store Slices

- `userSlice` – Handles user data (email, login, signup)
- `tokenSlice` – Provides `fetchWithAuth()` for auto token refresh and queued fetches during refresh
- `coursesSlice` – Manages courses and related logic
- `lessonSlice` – Stores current lesson data and functions
- `cacheSlice` – Caches lessons for faster navigation
- `profileSlice` – Handles global states for profile picture, background, and cropping
- `navSlice` – Provides navigation hooks

---

### Authentication & Fetch Handling

- Every data fetch validates the JWT.
- If expired, the app attempts a **token refresh**.
- Multiple concurrent fetches share a single refresh request via a shared **refresh promise**, preventing duplicate network calls.
- Short-term tokens are stored in **localStorage**.

---

### Styling

- Combination of **Bootstrap**, **CSS Modules**, and **inline styles** for flexibility.
- Ensures responsive layout and component-level styling isolation.

---

## License

**Proprietary License**

This project is for **educational and demonstration purposes only**.  
Use, redistribution, or modification is **not permitted without written consent**.
