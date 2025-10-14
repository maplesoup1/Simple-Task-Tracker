# Simple Task Tracker


## Features & workflow

Register.tsx
  |
  | signup(email, password, name)
  v
authService.ts [FE]
  |
  | POST /api/auth/signup
  v
authRoutes.ts
  |
  | validate(signupSchema)
  v
authController.ts
  |
  | signup()
  v
authService.ts [BE]
  |-------------------------------------> supabase.auth.signUp()
  |                                       (create auth.users, issue JWT)
  |<-------------------------------------
  |
  | userService.syncUser()
  v
userService.ts
  |
  | prisma.user.upsert()
  v
PostgreSQL (public.User)
  ^
  |
  +---------------------- back to authService.ts [BE]
                             |
                             | return { user, session }
                             v
authController.ts
  |
  | return to client
  v
authService.ts [FE]
  |
  | localStorage.setItem(user, token)
  | POST /api/auth/sync
  v
(authController.ts - syncUser)
  |
  | supabase.auth.getUser()
  v
supabase.auth
  |
  | user
  v
(authController.ts - syncUser)
  |
  | prisma.user.upsert()
  v
PostgreSQL
  ^
  |
  +---------------------- synced user to client
                             v
authService.ts [FE]
  |
  | setUser(user)
  v
AuthContext.tsx
  |
  | navigate("/tasks")
  v
Router


Login workflow

Login.tsx
  |
  | login(email, password)
  v
authService.ts [FE]
  |
  | POST /api/auth/login
  v
authRoutes.ts
  |
  | validate(loginSchema)
  v
authController.ts
  |
  | login()
  v
authService.ts [BE]
  |-------------------------------------> supabase.auth.signInWithPassword()
  |                                       (verify password, issue JWT)
  |<-------------------------------------
  |
  | return { user, session }
  v
authController.ts
  |
  | return to client
  v
authService.ts [FE]
  |
  | localStorage.setItem(user, token)
  | POST /api/auth/sync
  v
(authController.ts - syncUser)
  |
  | supabase.auth.getUser()
  v
supabase.auth
  |
  | user
  v
(authController.ts - syncUser)
  |
  | prisma.user.upsert()
  v
PostgreSQL
  ^
  |
  +---------------------- synced user to client
                             v
authService.ts [FE]
  |
  | setUser(user)
  v
AuthContext.tsx
  |
  | navigate("/tasks")
  v
Router

Protected request
Task.tsx
  |
  | useTasks()
  v
taskService.ts [FE]
  |
  | GET /api/tasks
  | Header: Authorization: Bearer <token>
  v
app.ts  ->  taskRoutes
  |
  | router.use(requireAuth)
  v
requireAuth.ts
  |
  | supabase.auth.getUser(token)
  v
supabase.auth
  |
  | validated (JWT OK)
  v
requireAuth.ts
  |
  | userService.syncUser()
  v
userService.ts
  |
  | prisma.user.upsert()
  v
PostgreSQL (public.User)
  ^
  |
  +---------------------- back to requireAuth.ts
                             |
                             | req.userId = user.id; next()
                             v
taskController.ts
  |
  | listTasks()
  v
taskService.ts [BE]
  |
  | prisma.task.findMany({ userId })
  v
PostgreSQL (public.Task)
  |
  | rows -> grouped { TODO, INPROGRESS, DONE }
  v
taskService.ts [BE]
  |
  | payload
  v
taskController.ts
  |
  | response { TODO: [...], INPROGRESS: [...], DONE: [...] }
  v
taskService.ts [FE]
  |
  | -> useTasks()
  v
Task.tsx
  |
  | render 3 columns
  v
UI




- **UI** -https://www.figma.com/community/file/1474180067272970933/task-tracker original design

-https://www.figma.com/design/3kAT4ANXAbqXKvwNg6qsCf/TASK-TRACKER--Community-?node-id=0-1&p=f&t=L0WhGhPVWM1Q5Gbd-0 my simple version
- **User Authentication** - supabase auth JWT token Supabase PostgreSQL User table prisma ORM
- **Drag & Drop** - Intuitive task organization with @hello-pangea/dnd
link: https://github.com/hello-pangea/dnd
- **Task Management** - Create, edit, delete, and move tasks between columns (TODO, IN PROGRESS, DONE)
- **Real-time Updates** - Automatic synchronization across sessions
- **Responsive Design** - Clean UI built with Tailwind CSS
- **Password Security** - Enforced password complexity requirements

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API communication
- React Router for navigation
- @hello-pangea/dnd for drag and drop

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- Zod for validation
- Supabase Auth for authentication

## Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- PostgreSQL database (via Supabase)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Simple Task Tracker"
```

### 2. Backend Setup

```bash
cd simple-task-tracker-backend
npm install
```

Create `.env` file in `simple-task-tracker-backend`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_url_with_pgbouncer
DIRECT_URL=your_direct_database_url
PORT=8000
API_BASE=http://localhost:8000/api
```

Run Prisma migrations:

```bash
npx prisma generate
npx prisma db push
```

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
cd simple-task-tracker-frontend
npm install
```

Create `.env` file in `simple-task-tracker-frontend`:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Database Schema

### User
- id (UUID, Primary Key)
- email (String, Unique)
- name (String, Optional)
- createdAt (DateTime)

### Task
- id (Int, Primary Key, Auto-increment)
- title (String)
- description (String, Optional)
- status (Enum: TODO, INPROGRESS, DONE)
- userId (UUID, Foreign Key)
- position (Decimal)
- createdAt (DateTime)
- updatedAt (DateTime)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/sync` - Sync user to database

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Change task status
- `POST /api/tasks/:id/move` - Move task (with position)
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/count` - Get task count by status

## Password Requirements

Passwords must contain:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number

## Project Structure

```
Simple Task Tracker/
├── simple-task-tracker-backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
│
└── simple-task-tracker-frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   └── App.tsx
    └── package.json
```

## Development

### Backend Development
```bash
cd simple-task-tracker-backend
npm run dev
```

### Frontend Development
```bash
cd simple-task-tracker-frontend
npm start
```

## Build for Production

### Backend
```bash
cd simple-task-tracker-backend
npm run build
npm start
```

### Frontend
```bash
cd simple-task-tracker-frontend
npm run build
```

## License

ISC
