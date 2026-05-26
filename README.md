# 🚀 TaskSphere - Modern Task Management Application

A full-stack task management platform built with **React**, **Node.js**, **Express**, and **MySQL**. Features include JWT authentication, real-time updates, dashboard analytics, dark mode, and responsive design.

![TaskSphere](https://img.shields.io/badge/TaskSphere-v1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)

## ✨ Features

### Authentication & Security
- ✅ JWT-based authentication with refresh tokens
- ✅ Secure password hashing (bcrypt)
- ✅ Role-based authorization (Admin & User)
- ✅ Password reset functionality
- ✅ Rate limiting & input validation
- ✅ Protected routes

### Task Management
- ✅ Complete CRUD operations
- ✅ Priority levels (Low, Medium, High)
- ✅ Status tracking (Pending, In Progress, Completed)
- ✅ Due dates and descriptions
- ✅ Advanced filtering & search
- ✅ Bulk operations (update/delete)
- ✅ Overdue task tracking

### Dashboard & Analytics
- ✅ Real-time statistics
- ✅ Task breakdown by status/priority
- ✅ Weekly activity charts
- ✅ Productivity metrics
- ✅ Upcoming deadlines
- ✅ Recent activity feed

### UI/UX
- ✅ Modern, clean interface
- ✅ Dark/Light mode toggle
- ✅ Fully responsive design
- ✅ Smooth animations (Framer Motion)
- ✅ Toast notifications
- ✅ Loading states & skeletons

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization
- **Heroicons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
tasksphere/
├── server/                 # Backend API
│   ├── config/
│   │   ├── database.js     # MySQL connection
│   │   └── schema.sql      # Database schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   └── validation.js   # Input validation
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── jwt.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── client/                 # Frontend React App
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Tasks.js
│   │   │   └── Profile.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   └── dashboardService.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tasksphere
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd server
npm install
```

#### Setup MySQL Database

1. Start MySQL server
2. Create the database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE tasksphere;
EXIT;
```

3. Import the schema:

```bash
mysql -u root -p tasksphere < config/schema.sql
```

Or manually run the SQL commands from `config/schema.sql`

#### Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update the following:

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tasksphere

# JWT Secrets (generate strong secrets in production)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this
REFRESH_TOKEN_SECRET=your-refresh-secret-key-min-32-characters-change-this
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:3000
```

#### Create Admin User

After running the schema, create a test admin user by hashing a password first:

```javascript
// Run this in Node.js REPL
const bcrypt = require('bcryptjs');
bcrypt.hash('Admin@123', 10, (err, hash) => console.log(hash));
```

Then insert into database:

```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@tasksphere.com', 'PASTE_HASHED_PASSWORD_HERE', 'admin');
```

#### Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

#### Configure Environment (Optional)

Create `.env` in the client folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start Frontend

```bash
npm start
```

Application will open at `http://localhost:3000`

## 📱 Usage

### Default Credentials

**Admin Account:**
- Email: `admin@tasksphere.com`
- Password: `Admin@123`

### Creating a New Account

1. Go to `/register`
2. Fill in the registration form
3. Passwords must contain:
   - At least 6 characters
   - One uppercase letter
   - One lowercase letter
   - One number

### Managing Tasks

1. Navigate to **Dashboard** or **Tasks** page
2. Click **Add Task** button
3. Fill in task details:
   - Title (required)
   - Description (optional)
   - Priority (Low/Medium/High)
   - Status (Pending/In Progress/Completed)
   - Due Date (optional)
4. Click **Create Task**

### Filtering & Searching

- Use the search bar to find tasks by title/description
- Filter by:
  - Status
  - Priority
  - Due date
  - Overdue tasks
- Sort by:
  - Created date
  - Due date
  - Priority

### Bulk Operations

1. Select multiple tasks using checkboxes
2. Use bulk action buttons to:
   - Update status of multiple tasks
   - Delete multiple tasks

## 🔒 API Endpoints

### Authentication

```http
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login
GET    /api/auth/me                # Get current user
POST   /api/auth/refresh           # Refresh token
POST   /api/auth/logout            # Logout
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password/:token  # Reset password
PUT    /api/auth/change-password   # Change password
```

### Tasks

```http
GET    /api/tasks                  # Get all tasks (with filters)
GET    /api/tasks/:id              # Get single task
POST   /api/tasks                  # Create task
PUT    /api/tasks/:id              # Update task
DELETE /api/tasks/:id              # Delete task
GET    /api/tasks/overdue/list     # Get overdue tasks
GET    /api/tasks/due-week/list    # Tasks due this week
PATCH  /api/tasks/bulk/status      # Bulk update status
DELETE /api/tasks/bulk/delete      # Bulk delete
```

### Dashboard

```http
GET    /api/dashboard/stats        # Get statistics
GET    /api/dashboard/productivity # Productivity metrics
GET    /api/dashboard/activity     # Recent activity
GET    /api/dashboard/deadlines    # Upcoming deadlines
```

### Users

```http
GET    /api/users/profile          # Get profile
PUT    /api/users/profile          # Update profile
GET    /api/users                  # Get all users (Admin)
```

## 🧪 Testing

### Test the Backend API

Use Postman, Thunder Client, or curl:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Get tasks (with token)
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎨 Customization

### Change Theme Colors

Edit `client/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these values
        500: '#your-color',
        600: '#your-color',
      },
    },
  },
}
```

### Add New Features

1. Create new model in `server/models/`
2. Add controller in `server/controllers/`
3. Define routes in `server/routes/`
4. Create service in `client/src/services/`
5. Build UI components in `client/src/components/`

## 📦 Deployment

### Backend (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Build the production bundle:
```bash
cd client
npm run build
```

2. Deploy the `build` folder

### Database (MySQL Cloud)

- Use MySQL Atlas, PlanetScale, or AWS RDS
- Update `DB_HOST` in environment variables

## 🐛 Common Issues

### Database Connection Failed
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

### CORS Errors
- Check `CLIENT_URL` in server `.env`
- Verify CORS configuration in `server.js`

### JWT Errors
- Token expired: Use refresh token endpoint
- Invalid token: Login again

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

## 📄 License

MIT License - feel free to use this project for learning or portfolio purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ by [Your Name]**
