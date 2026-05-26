# TaskSphere Backend API

Complete REST API for TaskSphere Task Management Application built with Node.js, Express, and MySQL.

## Features

- ✅ JWT Authentication & Authorization
- ✅ Role-based Access Control (Admin & User)
- ✅ Complete CRUD Operations for Tasks
- ✅ Advanced Filtering & Search
- ✅ Dashboard Analytics
- ✅ Password Reset Functionality
- ✅ Input Validation & Sanitization
- ✅ Rate Limiting & Security Headers
- ✅ Error Handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup MySQL Database

Make sure MySQL is installed and running on your system.

Create the database and tables:

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE tasksphere;

# Exit MySQL
exit

# Run schema file
mysql -u root -p tasksphere < config/schema.sql
```

Or manually execute the SQL commands from `config/schema.sql`

### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the following in `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tasksphere

JWT_SECRET=your-super-secret-jwt-key-min-32-characters
REFRESH_TOKEN_SECRET=your-refresh-secret-key-min-32-characters
```

### 4. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| POST | `/api/auth/forgot-password` | Request password reset | Public |
| POST | `/api/auth/reset-password/:token` | Reset password | Public |
| PUT | `/api/auth/change-password` | Change password | Private |

### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get all user tasks | Private |
| GET | `/api/tasks/:id` | Get single task | Private |
| POST | `/api/tasks` | Create new task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |
| GET | `/api/tasks/overdue/list` | Get overdue tasks | Private |
| GET | `/api/tasks/due-week/list` | Get tasks due this week | Private |
| PATCH | `/api/tasks/bulk/status` | Bulk update task status | Private |
| DELETE | `/api/tasks/bulk/delete` | Bulk delete tasks | Private |

### Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Private |
| GET | `/api/dashboard/productivity` | Get productivity metrics | Private |
| GET | `/api/dashboard/activity` | Get recent activity | Private |
| GET | `/api/dashboard/deadlines` | Get upcoming deadlines | Private |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users/profile` | Get user profile | Private |
| PUT | `/api/users/profile` | Update user profile | Private |
| GET | `/api/users` | Get all users | Admin |

## Request Examples

### Register User

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Login

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Create Task

```json
POST /api/tasks
Headers: Authorization: Bearer <token>
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "priority": "high",
  "status": "pending",
  "dueDate": "2024-12-31"
}
```

### Filter Tasks

```
GET /api/tasks?status=pending&priority=high&sortBy=dueDate&order=asc
```

## Query Parameters

### Tasks Filtering

- `status` - Filter by status (pending, in_progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `search` - Search in title and description
- `dueDate` - Filter by specific due date
- `overdue` - Get overdue tasks (true/false)
- `sortBy` - Sort by field (createdAt, dueDate, priority, title, status)
- `order` - Sort order (asc, desc)
- `limit` - Number of results per page
- `page` - Page number for pagination

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Refresh token mechanism
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (parameterized queries)

## Database Schema

### Users Table
- id, name, email, password, role, avatar, isActive
- resetPasswordToken, resetPasswordExpires
- createdAt, updatedAt

### Tasks Table
- id, title, description, priority, status, dueDate
- userId (foreign key)
- createdAt, updatedAt

### Additional Tables
- labels - Task tags/labels
- task_labels - Many-to-many relationship
- refresh_tokens - Token management
- activity_logs - User activity tracking

## Project Structure

```
server/
├── config/
│   ├── database.js       # MySQL connection
│   └── schema.sql        # Database schema
├── controllers/
│   ├── authController.js
│   ├── taskController.js
│   └── dashboardController.js
├── middleware/
│   ├── auth.js           # JWT verification
│   └── validation.js     # Input validation
├── models/
│   ├── User.js
│   └── Task.js
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   ├── dashboardRoutes.js
│   └── userRoutes.js
├── utils/
│   └── jwt.js            # JWT utilities
├── .env.example
├── package.json
└── server.js             # Entry point
```

## Testing API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Frontend application

## Default Admin User

After running the schema, create an admin user:

```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@tasksphere.com', '$2b$10$hashed_password', 'admin');
```

Use bcrypt to hash the password before inserting.

## Common Issues

**Database Connection Failed:**
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database exists

**JWT Token Errors:**
- Token expired - refresh using `/api/auth/refresh`
- Invalid token - login again
- Check JWT_SECRET is set in `.env`

## License

MIT
