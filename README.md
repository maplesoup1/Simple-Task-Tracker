# Simple Task Tracker


## Features & workflow


SIGNUP WORKFLOW                            
sequenceDiagram
    autonumber
    participant R as Register.tsx
    participant AFS as authService.ts (frontend)
    participant AR as /api/auth/signup
    participant VR as authRoutes.ts
    participant AC as authController.ts
    participant AS as authService.ts (backend)
    participant SU as supabase.auth
    participant US as userService.ts
    participant DB as PostgreSQL (public.User)
    participant L as localStorage
    participant SYNC as /api/auth/sync
    participant AC2 as authController.ts (sync)
    participant SU2 as supabase.auth.getUser
    participant US2 as userService.ts (sync)
    participant Ctx as AuthContext.tsx
    participant Nav as Router (/tasks)

    R->>AFS: signup(email, password, name)
    AFS->>AR: POST /api/auth/signup
    AR->>VR: validate(signupSchema)
    VR->>AC: forward
    AC->>AS: signup()
    AS->>SU: supabase.auth.signUp()
    SU-->>AS: { user, session, JWT }
    AS->>US: userService.syncUser()
    US->>DB: prisma.user.upsert()
    DB-->>US: upserted user
    US-->>AS: user
    AS-->>AC: { user, session }
    AC-->>AFS: { user, session }

    AFS->>L: localStorage.setItem(user, token)
    AFS->>SYNC: POST /api/auth/sync
    SYNC->>AC2: syncUser()
    AC2->>SU2: supabase.auth.getUser()
    SU2-->>AC2: user
    AC2->>US2: prisma.user.upsert()
    US2->>DB: upsert
    DB-->>US2: ok
    AC2-->>AFS: synced user

    AFS-->>Ctx: setUser(user)
    Ctx-->>Nav: navigate("/tasks")

LOGIN Workflow
sequenceDiagram
    autonumber
    participant Lg as Login.tsx
    participant AFS as authService.ts (frontend)
    participant AL as /api/auth/login
    participant VR as authRoutes.ts
    participant AC as authController.ts
    participant AS as authService.ts (backend)
    participant SU as supabase.auth
    participant L as localStorage
    participant SYNC as /api/auth/sync
    participant AC2 as authController.ts (sync)
    participant SU2 as supabase.auth.getUser
    participant US as userService.ts
    participant DB as PostgreSQL
    participant Ctx as AuthContext.tsx
    participant Nav as Router (/tasks)

    Lg->>AFS: login(email, password)
    AFS->>AL: POST /api/auth/login
    AL->>VR: validate(loginSchema)
    VR->>AC: forward
    AC->>AS: login()
    AS->>SU: signInWithPassword()
    SU-->>AS: { user, session, JWT }
    AS-->>AC: { user, session }
    AC-->>AFS: { user, session }

    AFS->>L: localStorage.setItem(user, token)
    AFS->>SYNC: POST /api/auth/sync
    SYNC->>AC2: syncUser()
    AC2->>SU2: supabase.auth.getUser()
    SU2-->>AC2: user
    AC2->>US: prisma.user.upsert()
    US->>DB: upsert
    DB-->>US: ok
    AC2-->>AFS: synced user

    AFS-->>Ctx: setUser(user)
    Ctx-->>Nav: navigate("/tasks")


Protected workflow

sequenceDiagram
    autonumber
    participant Lg as Login.tsx
    participant AFS as authService.ts (frontend)
    participant AL as /api/auth/login
    participant VR as authRoutes.ts
    participant AC as authController.ts
    participant AS as authService.ts (backend)
    participant SU as supabase.auth
    participant L as localStorage
    participant SYNC as /api/auth/sync
    participant AC2 as authController.ts (sync)
    participant SU2 as supabase.auth.getUser
    participant US as userService.ts
    participant DB as PostgreSQL
    participant Ctx as AuthContext.tsx
    participant Nav as Router (/tasks)

    Lg->>AFS: login(email, password)
    AFS->>AL: POST /api/auth/login
    AL->>VR: validate(loginSchema)
    VR->>AC: forward
    AC->>AS: login()
    AS->>SU: signInWithPassword()
    SU-->>AS: { user, session, JWT }
    AS-->>AC: { user, session }
    AC-->>AFS: { user, session }

    AFS->>L: localStorage.setItem(user, token)
    AFS->>SYNC: POST /api/auth/sync
    SYNC->>AC2: syncUser()
    AC2->>SU2: supabase.auth.getUser()
    SU2-->>AC2: user
    AC2->>US: prisma.user.upsert()
    US->>DB: upsert
    DB-->>US: ok
    AC2-->>AFS: synced user

    AFS-->>Ctx: setUser(user)
    Ctx-->>Nav: navigate("/tasks")


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
