# WorkFlow - Employee & Task Management System

A full-stack MERN application for managing employees, group projects, and tasks. Admins can create projects, assign tasks, and monitor progress in real time. Employees can view their assignments, update progress, and track deadlines.

**Live Demo:** [Frontend (Vercel)](https://workflow-management-system-mern.vercel.app) | [Backend (Render)](https://workflow-management-system-mern.onrender.com)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router DOM 7, Vite 8, Tailwind CSS 4 |
| Backend | Express 5, Mongoose 9 |
| Database | MongoDB Atlas |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios |
| Deployment | Vercel (frontend), Render (backend) |

---

## Features

### Admin
- **Employee Management** -- View, add, update status, and delete employees
- **Project Management** -- Create group projects, assign team members, edit/delete projects
- **Task Assignment** -- Assign tasks to employees (project-linked or individual), set deadlines
- **Live Task Monitor** -- Auto-refreshing view of all tasks with progress, status, and overdue detection
- **Project Tracker** -- Real-time project progress with per-member breakdown

### Employee
- **Dashboard** -- Stats cards, daily tasks, performance charts, and deadline countdown
- **Projects Tab** -- View assigned projects with progress bars
- **Completed Tasks** -- Review completed work and remove from view
- **Schedule** -- View upcoming deadlines
- **Notifications** -- Pending and recently completed tasks with badge count
- **Progress Updates** -- Submit progress percentage and descriptions to admin

### General
- Responsive design (mobile + desktop)
- Mobile bottom navigation and sidebar overlay
- Real-time polling for live data (5-10s intervals)
- Soft-delete pattern for tasks
- Auto-calculated project progress from task averages

---

## Project Structure

```
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images and icons
│   │   ├── components/
│   │   │   ├── AdminSidebar.jsx     # Admin navigation sidebar
│   │   │   ├── AdminTopbar.jsx      # Top bar + project creation modal
│   │   │   ├── AdminStats.jsx       # Admin overview statistics
│   │   │   ├── AdminTaskManager.jsx # Task assignment portal
│   │   │   ├── AdminTaskMonitor.jsx # Live task status monitor
│   │   │   ├── AdminProjectTracker.jsx
│   │   │   ├── StatsCards.jsx       # User stats cards
│   │   │   ├── TasksSection.jsx     # User daily tasks
│   │   │   ├── ProjectCards.jsx     # User project cards
│   │   │   ├── EmployeeTable.jsx    # Employee directory table
│   │   │   ├── PerformanceCharts.jsx# Pie chart analytics
│   │   │   ├── DeadlineCountdown.jsx
│   │   │   └── Timeline.jsx         # Project timeline visualization
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── UserDashboard.jsx    # Employee dashboard
│   │   │   ├── AdminDashboard.jsx   # Admin layout (nested routes)
│   │   │   └── Employees.jsx        # Employee management page
│   │   ├── App.jsx                  # Router + route definitions
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── vercel.json                  # SPA rewrite rules
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Backend (Express + MongoDB)
│   ├── server.js                    # All routes, models, config, and seeding
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Start the server:

```bash
node server.js
```

The server runs on `http://localhost:5000`. On first startup, it auto-seeds 16 employees (1 admin + 15 regular) into the database if the Employee collection is empty.

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## API Endpoints

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all non-archived tasks |
| GET | `/tasks/:employeeId` | Get tasks for a specific employee |
| POST | `/assign-task` | Create/assign a new task |
| PUT | `/update-task/:id` | Update task progress |
| PUT | `/complete-task/:id` | Mark task as completed |
| PUT | `/hide-task/:id` | Soft-delete task from user view |
| DELETE | `/delete-task/:id` | Permanently delete a task |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/all-projects` | Get all projects |
| GET | `/projects/:employeeId` | Get projects for a specific employee |
| POST | `/create-project` | Create a new project |
| PUT | `/update-project/:id` | Update project details |
| DELETE | `/delete-project/:id` | Delete project and its tasks |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | Get all employees |
| GET | `/employees/:id` | Get a single employee |
| POST | `/employees` | Create a new employee |
| PUT | `/employees/:id` | Update employee |
| DELETE | `/employees/:id` | Delete an employee |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Authenticate user by email and password |

---

## Data Models

### Task

| Field | Type | Description |
|-------|------|-------------|
| title | String | Task title (required) |
| description | String | Task description |
| assignTo | String | Employee ID (required) |
| assignToName | String | Employee name |
| projectId | String | Linked project ID |
| deadline | String | Due date |
| progress | Number | 0-100 |
| completed | Boolean | Completion status |
| userDeleted | Boolean | Soft-deleted from user view |
| archived | Boolean | Soft-deleted from admin view |
| completedAt | Date | Completion timestamp |

### Project

| Field | Type | Description |
|-------|------|-------------|
| title | String | Project title (required) |
| description | String | Project description |
| team | [String] | Array of employee IDs |
| deadline | String | Due date |
| progress | Number | Auto-calculated from tasks |
| status | String | Active, On Hold, or Completed |

### Employee

| Field | Type | Description |
|-------|------|-------------|
| id | String | Custom ID, e.g. GPK-25-003 (required, unique) |
| name | String | Employee name (required) |
| role | String | Job role (required) |
| department | String | Department |
| status | String | Active, Working, or On Leave |
| email | String | Login email |
| password | String | Login password |
| isAdmin | Boolean | Admin privileges |

---

## NPM Scripts

### Client

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Start dev server with HMR |
| `npm run build` | `vite build` | Production build |
| `npm run preview` | `vite preview` | Preview production build |
| `npm run lint` | `eslint .` | Run ESLint |

### Server

```bash
node server.js     # Start production server
npx nodemon server.js  # Start with auto-reload (dev)
```

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin05 |
| Employee | sathiyapriya@test.com | 123 |

> New employees are created with the default password `123`.

---

## License

This project does not currently have a license.
