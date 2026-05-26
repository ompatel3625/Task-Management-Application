# 🚀 TaskSphere - Quick Start Guide

## 📦 What's Included

Your complete full-stack task management application with:
- ✅ Backend API (Node.js + Express + MySQL)
- ✅ Frontend (React + Tailwind CSS)
- ✅ Authentication & Authorization
- ✅ Task CRUD Operations
- ✅ Dashboard with Analytics
- ✅ Dark/Light Mode
- ✅ Responsive Design

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- npm or yarn

### Step 1: Extract the Project
```bash
unzip tasksphere-fullstack-project.zip
cd tasksphere
```

### Step 2: Setup Backend

#### Install Dependencies
```bash
cd server
npm install
```

#### Setup MySQL Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE tasksphere;
EXIT;

# Import schema
mysql -u root -p tasksphere < config/schema.sql
```

#### Configure Environment
```bash
cp .env.example .env
```

Edit `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tasksphere

JWT_SECRET=your-super-secret-jwt-key-min-32-characters
REFRESH_TOKEN_SECRET=your-refresh-secret-key-min-32-characters
```

#### Create Admin User
```bash
# In MySQL
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@tasksphere.com', 
'$2b$10$YDzPaKlWqVq4h.xHVQBYzOYGLHZqYz.x9QEQHZzQ7xZfZxZqYqYqY', 'admin');
```

Default password: `Admin@123`

#### Start Backend
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Setup Frontend

Open new terminal:

```bash
cd client
npm install
npm start
# App opens at http://localhost:3000
```

## 🎯 Test the Application

1. Go to `http://localhost:3000`
2. Login with:
   - Email: `admin@tasksphere.com`
   - Password: `Admin@123`
3. Start creating tasks!

## 📁 Project Structure

```
tasksphere/
├── server/              # Backend API
│   ├── config/          # DB config & schema
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & validation
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
│
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # State management
│   │   ├── layouts/     # Layout components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.js       # Main app
│   └── package.json
│
└── README.md           # Full documentation
```

## 🔑 Features

### Authentication
- JWT-based authentication
- Refresh tokens
- Password reset
- Role-based access (Admin/User)

### Task Management
- Create, Read, Update, Delete tasks
- Priority levels (Low, Medium, High)
- Status tracking (Pending, In Progress, Completed)
- Due dates
- Search & filter
- Bulk operations

### Dashboard
- Real-time statistics
- Task breakdown charts
- Weekly activity graph
- Recent tasks

### UI/UX
- Dark/Light mode
- Fully responsive
- Smooth animations
- Toast notifications

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Framer Motion
- Axios
- React Router
- Recharts

**Backend:**
- Node.js
- Express.js
- MySQL
- JWT
- bcryptjs
- Helmet

## 📚 API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Tasks
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

### Dashboard
- GET `/api/dashboard/stats` - Get statistics
- GET `/api/dashboard/activity` - Recent activity

## 🐛 Common Issues

### Port Already in Use
```bash
npx kill-port 5000  # Backend
npx kill-port 3000  # Frontend
```

### Database Connection Error
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

### CORS Errors
- Check `CLIENT_URL` in server `.env`
- Default: `http://localhost:3000`

## 🚀 Deployment

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the build/ folder
```

### Database
- Use MySQL Atlas, PlanetScale, or AWS RDS
- Update DB credentials in environment

## 📝 Next Steps

1. **Customize:** Update colors in `tailwind.config.js`
2. **Add Features:** Implement file uploads, email notifications
3. **Deploy:** Push to production
4. **Portfolio:** Add to your GitHub portfolio

## 🤝 Support

For issues or questions:
- Check the main `README.md`
- Review server logs: `server/` terminal
- Check browser console: Developer Tools

## 📄 License

MIT - Free to use for learning and portfolio projects

---

**Happy Coding! 🎉**

Built with ❤️ for aspiring full-stack developers
