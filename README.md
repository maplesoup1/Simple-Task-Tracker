# Simple Task Tracker


## Features & workflow
Signup workflow
Register.tsx
  → authService.ts (frontend): signup(email, password, name)
  → POST /api/auth/signup
  → authRoutes.ts: validate(signupSchema)
  → authController.ts: signup()
  → authService.ts (backend): supabase.auth.signUp()
  → Supabase: create auth.users + issue JWT
  → userService.syncUser() → Prisma upsert → PostgreSQL (public.User)
  → return { user, session } to client
  → authService.ts (frontend): localStorage.setItem(...)
  → POST /api/auth/sync
  → authController.ts (sync): supabase.auth.getUser() → Prisma upsert → PostgreSQL
  → AuthContext.setUser(user)
  → navigate('/tasks')
Login work flow
Login.tsx
  → authService.ts (frontend): login(email, password)
  → POST /api/auth/login
  → authRoutes.ts: validate(loginSchema)
  → authController.ts: login()
  → authService.ts (backend): supabase.auth.signInWithPassword()
  → Supabase: verify password + issue JWT
  → return { user, session } to client
  → authService.ts (frontend): localStorage.setItem(...)
  → POST /api/auth/sync
  → authController.ts (sync): supabase.auth.getUser() → Prisma upsert → PostgreSQL
  → AuthContext.setUser(user)
  → navigate('/tasks')

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

## design tradeoffs
Temporarily disabling Supabase registration email verification.
More like a personal task tracker, tasks cannot be shared among multiple users.
Currently using the Context API; if functionality is expanded, Redux may be required.
Currently refreshing data manually, not using Supabase Realtime.

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
│   │   ├── __tests__/
│   │   │   ├── setup.ts
│   │   │   └── taskService.test.ts
│   │   ├── config/
│   │   │   └── swagger.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── taskController.ts
│   │   │   └── userController.ts
│   │   ├── middlewares/
│   │   │   ├── requireAuth.ts
│   │   │   └── validate.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── taskRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── taskService.ts
│   │   │   └── userService.ts
│   │   ├── types/
│   │   │   └── express.d.ts
│   │   ├── utils/
│   │   │   ├── prisma.ts
│   │   │   ├── supabaseClient.ts
│   │   │   └── validation.ts
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
└── simple-task-tracker-frontend/
    ├── public/
    ├── src/
    │   ├── __tests__/                    # Unit tests
    │   │   ├── addTaskForm.submit.test.tsx
    │   │   ├── taskCard.render.test.tsx
    │   │   ├── taskCard.todoStatus.test.tsx
    │   │   ├── taskCard.inprogressStatus.test.tsx
    │   │   └── taskCard.doneStatus.test.tsx
    │   ├── assets/                       # Static resources
    │   ├── components/                   # React components
    │   │   ├── common/                   # Reusable UI components
    │   │   │   ├── ErrorDisplay.tsx
    │   │   │   ├── LoadingSpinner.tsx
    │   │   │   └── SearchBar.tsx
    │   │   ├── layout/                   # Layout components
    │   │   │   └── PageHeader.tsx
    │   │   ├── modal/                    # Modal components
    │   │   │   ├── ConfirmModal.tsx
    │   │   │   └── PopupProvider.tsx
    │   │   ├── task/                     # Task-related components
    │   │   │   ├── AddTaskForm.tsx
    │   │   │   ├── TaskBoard.tsx
    │   │   │   ├── TaskCard.tsx
    │   │   │   ├── TaskColumn.tsx
    │   │   │   └── TaskDetailModal.tsx
    │   │   └── PrivateRoute.tsx
    │   ├── constants/                    # App constants
    │   │   ├── taskStatus.ts
    │   │   └── theme.ts
    │   ├── contexts/                     # React Context (global state)
    │   │   └── AuthContext.tsx           # Auth state provider + useAuth hook
    │   ├── hooks/                        # Custom React hooks
    │   │   ├── useModal.ts
    │   │   ├── useTasks.ts
    │   │   ├── useTaskDragDrop.ts
    │   │   └── useTaskSearch.ts
    │   ├── pages/                        # Page components
    │   │   ├── private/
    │   │   │   └── Task.tsx
    │   │   └── public/
    │   │       ├── Hero.tsx
    │   │       ├── Login.tsx
    │   │       └── Register.tsx
    │   ├── routers/                      # Route configuration
    │   │   ├── index.tsx
    │   │   ├── PrivateRoutes.tsx
    │   │   └── PublicRoutes.tsx
    │   ├── services/                     # API & business logic
    │   │   ├── api.ts
    │   │   ├── authService.ts
    │   │   └── taskService.ts
    │   ├── types/                        # TypeScript type definitions
    │   │   ├── auth.types.ts
    │   │   ├── component.types.ts
    │   │   ├── task.types.ts
    │   │   └── index.ts
    │   ├── utils/                        # Utility functions
    │   │   ├── errorHandler.ts
    │   │   └── taskFilter.ts
    │   ├── App.tsx
    │   └── index.tsx
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

## Testing

### Backend Tests
The backend includes unit tests for the task service layer.

**Run all backend tests:**
```bash
cd simple-task-tracker-backend
npm test
```

**Test coverage:**
- Task Service (`taskService.test.ts`)
  - Create task
  - Get tasks by user
  - Update task
  - Delete task
  - Move task position

### Frontend Tests
The frontend includes component tests using React Testing Library.

**Run all frontend tests:**
```bash
cd simple-task-tracker-frontend
npm test
```

**Test coverage:**
- App Component (`App.test.tsx`) - Basic rendering
- Task Card (`taskCard.*.test.tsx`)
  - Render test - Component rendering and props
  - Status tests - TODO, IN PROGRESS, DONE status display
- Add Task Form (`addTaskForm.submit.test.tsx`) - Form submission

**Run tests in watch mode:**
```bash
npm test -- --watch
```

**Run tests with coverage:**
```bash
npm test -- --coverage
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
