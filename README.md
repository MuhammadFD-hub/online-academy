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
  - [Backend](#backend)
    - [Mongodb](#mongodb)
    - [Express.js](#expressjs)
  - [Frontend](#frontend)
    - [React.js](#reactjs)
      - [Summary of Context Providers](#summary-of-context-providers)
      - [React Router DOM](#react-router-dom)
  - [📄 License](#-license)

## Intro

The project is built using the **MERN stack** (MongoDB, Express, React, Node.js). I created this project to understand how the frontend, backend, and database work together in a full-stack web application. Through this project, I learned how to:

- Use **React.js** for building dynamic UIs
- Connect frontend to a backend API
- Manage user authentication and course data
- Work with MongoDB and Mongoose

## How to use

- Download provided files
- backend and frontend dont have node modules, just type 'npm i' in cmd in both folders (backend and frontend)
- type 'node server.js' to run backend
- use 'npm run dev' to run frontend (vite)
- to reset backend run 'npm run seed' in backend

**When using project dont add any sensitive information on it.**

## Learning Process

While building this, I used **ChatGPT** for help whenever I was stuck or faced multiple implementation options. Although the backend code and some parts of the UI (e.g., Bootstrap styling) were generated with AI help, I fully understand how the app works and can explain each part of it.

## Backend

MongoDB, Mongoose Models, Express.js

### Mongodb

The database stores:

1. User
2. Courses
3. Lesson
4. User Progress

- <u>**User**</u>

  Each user have:

  - email
  - passwordHash
  - timestamps

  password is not plainly stored, instead passwordHash is created in server using bycrypt and then it is stored in DB.
  timestamp automatically adds and manages two fields: createdAt, updatedAt.

- <u>**Courses**</u>

  Each course have:

  - Title
  - Description
  - lessons (reference)

Course have reference of all lesson that are included in the course.

- <u>**Lesson**</u>

  Each lesson have:

  - title
  - content
  - course (reference)
  - order (will used in future)

  Lesson content have markdown lesson saved init. Lesson also have course reference to which it belongs to. Lesson order refers to the position or index of the lesson within the course.

- <u>**User Progress**</u>

  This contains:

  - user (id reference)
  - course (reference)
  - readLessons (array of reference)

  When a user enrolls in a course, a record is created like:

  ```js
  [
    { userId, courseId, [] }
  ]
  ```

  If the user enrolls in more courses:

  ```js
  [
    { userId: 1, courseId: 1, lessons: [] },
    { userId: 1, courseId: 2, lessons: [] },
  ];
  ```

  If the user starts reading lessons, it looks like:

  ```js
  [
    { userId: 1, courseId: 1, lessons: [lessonId1] },
    { userId: 1, courseId: 2, lessons: [lessonId1, lessonId2] },
  ];
  ```

  Each record tracks the user’s enrollment and progress for a specific course.
  The lessons array holds the IDs of lessons the user has read.

### Express.js

Express.js has four main routes:

1. authRoutes
2. coursesRoutes
3. lessonRoutes
4. userRoutes

Side note: All routes (except authRoutes) receives Json Web Token (jwt) with request. Every request is verified by a middleware (authToken.js), if something wrong it logs user out. Token have encrypted userId init, and this id is used for processes.

- <u>authRoutes</u>

  it has `/signup`, `/login` init.

  - `/signup`: checks credentials, encrypt password, makes account if not exist, and returns jwt which has userId, session expiry.
  - `/login`: checks credentials, returns jwt, which has userId, session expiry

- <u>coursesRoutes</u>

  it has `/userId`, `/enroll`, `/`_courseId_`/lessons`

  - `/userId` returns courses with enrolled status
  - `/enroll` enrolls user in given courseId
  - `/`_courseId_`/lessons` returns lesson (without content) for that course id

- <u>lessonRoutes</u>

  It has `/`_lessonId_, `/mark-read`

  - `/`_lessonId_ returns lesson for given id
  - `/mark-read` add provided _lessonId_ in readLessons which is in userProgress

- <u>userRoutes</u>

  it has `/dashboard`

  - `/dashboard` returns total enrolled count and each course title with course progress (readLessons/totalLessons)

## Frontend

react, bootstrap, react-router-dom

### React.js

- <u>AuthProvider</u>

  On mount it schedules logout according to received expiry (on login). It provides login, logout, signup, setLocal.

  - **login**

    Sends post request with email, and password. Receives jwt in response, decode and extract user from it. Saves token and user locally. Then it navigates to courses page

  - **signup**

    same as login just creates account at server.

  - **logout**

    Removes user, jwt and other data locally, and navigates to '/', which automatically redirects to login page.

- <u>CourseProvider</u>

  On mount, fetches courses and store it in a context state. It provides courses, enroll function, findCourse function.

  - **enroll**

    Send post request along with courseId to enroll, and also changes courses local state accordingly.

- <u>LessonProvider</u>

  provides fetchLesson, markRead, parseLessonString function. It doesn't store lesson in the context state

  - **fetchLesson**

    This fetch the lesson with full content, only if it is not cached

  - **parseLessonString**

    converts lesson's content to following:

    \# -> \<h1>
    \#\# -> \<h2>
    \#\#\# -> \<h3> ...
    so on
    \*a\* -> \<b\>a\<b\>
    \```lang code\``` -> \<div styles\>\<h5 styles\> lang \<h5/>\<pre>\<code>code\<code/>\<pre/>\<div/>
    every remaining line to \<p>

- <u>CacheProvider</u>

  The `CacheProvider` caches lesson data using two `Map` objects, **lesson** with `courseId` and **lessonContent** with `lessonId` as the key:

  - **Lessons Map:** Used in `CoursePage.jsx` to show a preview list of lessons (if cached).
  - **Lesson Content Map:** Used in `LessonPage.jsx` to display the full content of a lesson (if it’s already cached).

#### <u>Summary of Context Providers</u>

- All providers are implemented using **React Context**.
- Each context is exported and accessed via custom hooks.
- These custom hooks are used to fetch shared state and functions across components.
- The UI is built using **React**, **Bootstrap**, and custom **CSS**, which render data provided by these contexts.

#### <u>React Router DOM</u>

- The **sidebar** appears only when the user is logged in, using `<Outlet />`.
- For routes like `/`, `/login`, and `/signup`, the sidebar is hidden. For all other routes, the sidebar and header are displayed using `Outlet`.
- A shared **`Header`** is shown on all pages.
- All components that are not context providers are grouped in `RouteWrapper.jsx`.
- In `App.jsx`, some context providers (like `CourseProvider`, `LessonsProvider`, `CacheProvider`) are wrapped conditionally based on whether the `user` exists.
- The entry file `main.jsx` wraps the entire app with `AuthProvider` and `Router`.

## 📄 License

This project is licensed under a **proprietary license**.  
It is available for **educational and demonstration purposes only**.  
Use, redistribution, or modification is **not permitted without written consent**.
