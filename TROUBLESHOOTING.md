# 🔧 TaskSphere Setup & Troubleshooting Guide

## ⚡ Quick Fix for Your Error

The errors you're seeing:
- `POST /api/auth/login 500` - Server error (database connection issue)
- `POST /api/auth/register 400` - Bad request (validation or database issue)

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
PORT=5000

# IMPORTANT: Update these with your MySQL credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_ACTUAL_MYSQL_PASSWORD
DB_NAME=tasksphere

# JWT Secrets (can leave as-is for development)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key-change-in-production
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d

CLIENT_URL=http://localhost:3000
```

### Step 3: Setup Database (AUTOMATED)

**Option A: Automatic Setup (Recommended)**
```bash
npm run setup
```

This will:
- ✅ Create the database
- ✅ Create all tables
- ✅ Create admin user
- ✅ Test the connection

**Option B: Manual Setup**
```bash
# Login to MySQL
mysql -u root -p

# In MySQL console:
CREATE DATABASE tasksphere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Import schema
mysql -u root -p tasksphere < config/schema.sql
```

Then create admin user:
```bash
# In MySQL
USE tasksphere;

# Insert admin (password: Admin@123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@tasksphere.com', 
'$2b$10$YourHashHere', 'admin');
```

### Step 4: Start Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

### Step 5: Start Frontend

In a new terminal:
```bash
cd client
npm install
npm start
```

## 🐛 Troubleshooting Common Errors

### Error: "Database connection failed"

**Cause:** MySQL not running or wrong credentials

**Fix:**
1. Check MySQL is running:
   ```bash
   # Mac
   mysql.server status
   
   # Linux
   sudo systemctl status mysql
   
   # Windows
   # Check Services app
   ```

2. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```

3. Verify `.env` credentials match your MySQL setup

### Error: "ER_ACCESS_DENIED_ERROR"

**Cause:** Wrong MySQL password in `.env`

**Fix:**
1. Reset MySQL password or update `.env` with correct password
2. Make sure `DB_PASSWORD` in `.env` matches your MySQL root password

### Error: "ER_BAD_DB_ERROR: Unknown database"

**Cause:** Database doesn't exist

**Fix:**
```bash
npm run setup
```

OR

```bash
mysql -u root -p
CREATE DATABASE tasksphere;
EXIT;
```

### Error: "POST /api/auth/register 400"

**Causes:**
1. Password too weak
2. Email already exists
3. Missing required fields

**Fix:**
1. Use password with: uppercase, lowercase, number (min 6 chars)
2. Try different email
3. Check you're sending: `name`, `email`, `password`

**Test with curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### Error: "POST /api/auth/login 500"

**Causes:**
1. Database not connected
2. Users table doesn't exist
3. No user with that email

**Fix:**
1. Run `npm run setup` to create tables
2. Check server logs for actual error
3. Try registering first, then login

### Error: "Cannot find module"

**Cause:** Dependencies not installed

**Fix:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Error: Port 5000 already in use

**Fix:**
```bash
# Kill process on port 5000
npx kill-port 5000

# OR change port in .env
PORT=5001
```

## ✅ Verify Setup

### Test Database Connection

```bash
# In MySQL
mysql -u root -p tasksphere

# Show tables
SHOW TABLES;

# Should show:
# +---------------------+
# | Tables_in_tasksphere|
# +---------------------+
# | tasks               |
# | users               |
# +---------------------+

# Check admin user
SELECT * FROM users;
```

### Test API Endpoints

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Test@123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tasksphere.com","password":"Admin@123"}'
```

## 📊 Check Server Logs

Look for these messages in your server console:

**Good:**
```
✅ Database connected successfully
🚀 Server running on port 5000
🌍 Environment: development
```

**Bad:**
```
❌ Database connection failed: [error message]
```

If you see the bad message, the error details will tell you exactly what's wrong.

## 🆘 Still Having Issues?

1. **Check all requirements:**
   - Node.js installed? `node -v`
   - MySQL running? `mysql -V`
   - `.env` file created? `ls server/.env`

2. **Run automated setup:**
   ```bash
   cd server
   npm run setup
   ```

3. **Check the actual error in console:**
   - Look at the server terminal
   - The error message will tell you exactly what's wrong

4. **Start fresh:**
   ```bash
   # Drop and recreate database
   mysql -u root -p
   DROP DATABASE tasksphere;
   CREATE DATABASE tasksphere;
   EXIT;
   
   # Run setup again
   npm run setup
   ```

## 📝 Default Credentials

After setup, use these to login:
- **Email:** admin@tasksphere.com
- **Password:** Admin@123

## 🎯 Quick Commands Reference

```bash
# Backend
cd server
npm install              # Install dependencies
npm run setup           # Setup database automatically
npm run dev             # Start development server
npm start               # Start production server

# Frontend
cd client
npm install             # Install dependencies
npm start               # Start development server
npm run build           # Build for production

# Database
mysql -u root -p                        # Login to MySQL
CREATE DATABASE tasksphere;             # Create database
USE tasksphere;                         # Switch to database
SHOW TABLES;                            # Show all tables
SELECT * FROM users;                    # Show all users
```

---

**If you're still stuck, share the EXACT error message from your server console!**
