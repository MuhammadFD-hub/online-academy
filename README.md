# How to start app

- Download provided files
- backend and frontend dont have node modules, just type 'npm i' in cmd in both folders (backend and frontend)
- type 'node server.js' to run backend
- use 'npm run dev' to run frontend (vite)
- to reset backend run 'npm run seed' in backend

# Summary

### Features:
user can signup -> login -> see Course list -> enroll -> read lessons when enrolled -> check dashboard(current status) -> logout.

### frontend:
react, bootstrap, CSS, react-router-dom

### backend:
mongo db, mongoose models, express js, routes

### shared:
it uses jwt for sessions

# Technical Details

## Backend

### mongodb:
db stores user, courses, lesson, and user progress

in courses, each course have data + lessons reference array
in users, each user have email, passhash(jwt) and timestamp
in lessons, each lesson have data + course reference
user progress store progress, like this user is enrolled in this course and read these lessons
e.g user:id, course:id, lessons:[id array]
user id will repeat in document for other courses

### express:

it has four main routes: /courses, /auth, /user, /lesson

/courses have -> /user id, /enroll, /course id/lessons
/user id returns courses with enrolled status
/enroll get userId, courseId in body and enrolls user in course
/course id/lessons returns lesson(without content) for that course id

/auth have -> /signup, /login
/signup makes account if not exist
/login returns user id, jwt token, and session expiry time if exist and checks credentials

/lesson have -> /lesson id, /mark-read
/lesson id returns lesson
/mark-read add provided lesson id in readLessons

/user have -> /dashboard
/dashboard returns total enrolled count and each course title with course progress(read/total lesson)

## Frontend

### react:

AuthProvider : provides login, logout, signup, current user with help of server. It also saves user locally during login. It gets user, checks expiry and logout user respectively. It also provides setLocal (sets User data locally)

CourseProvider : uses useAuth, useFetch hook and provide courses, enroll function, findCourse function.

LessonProvider : provides fetchlesson, markRead, parseLessonString function. parseLessonString convert lesson content to following:
\# -> \<h1>
\#\# -> \<h2>
\#\#\# -> \<h3> 
so on
\*a\* -> \<b\>a\<b\>
\```lang code\``` -> \<div styles\>\<h5 styles\> lang \<h5/>\<pre>\<code>code\<code/>\<pre/>\<div/>
every remaining line to \<p>

All above contexts are exported and used as custom hooks.
All these custom hooks are used to get data and functions. React, bootstrap and CSS are used to display this provided data. If somehow custom hook dont work, then fetch is used in that component.

react router dom imp info:

i made sidebar appear only if logged in using outlet. if goes to pages other than /login, /signup display sidebar and other content using outlet

i added header on all pages and displayed content using outlet

### Other Info:

course and lesson provider are conditionally wrapped around components.
If user is null (when app starts) -> then dont wrap course and lesson provider around Routes (it causes error that user is null) and vice versa.
To easily implement above if condition, RouteWrapper component is used to wrap all routes and condition is implemented on RouteWrapper component.
