# 📚 Git Setup & Workflow Guide for TaskSphere

## 🎯 Quick Start with Git

### 1. Initialize Git Repository

```bash
cd tasksphere
git init
git add .
git commit -m "Initial commit: TaskSphere full-stack application"
```

### 2. Create GitHub Repository

1. Go to [github.com](https://github.com/new)
2. Create new repository named `tasksphere`
3. Choose: Public (for portfolio) or Private
4. **Do NOT** initialize with README, .gitignore, or license (we already have them)
5. Click "Create repository"

### 3. Connect Local to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/tasksphere.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 4. Verify Setup

```bash
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/tasksphere.git (fetch)
# origin  https://github.com/YOUR_USERNAME/tasksphere.git (push)
```

---

## 📝 What Gets Ignored (.gitignore)

### ✅ Files NOT tracked (ignored):

```
node_modules/           ← npm packages (reinstalled with npm install)
.env                    ← Secret keys and passwords
.env.local
build/                  ← Generated build files
dist/                   ← Production builds
.idea/                  ← IDE settings
.vscode/                ← VS Code settings
*.log                   ← Log files
.DS_Store               ← Mac OS files
Thumbs.db               ← Windows thumbnail cache
```

### ✅ Files TRACKED (included):

```
package.json            ← Dependencies list
package-lock.json       ← Lock file
.gitignore              ← This file
README.md               ← Documentation
QUICK_START.md
TROUBLESHOOTING.md
src/                    ← Source code
config/                 ← Configuration files
controllers/
routes/
models/
```

---

## 🔐 Protecting Secrets

### Why `.env` is ignored:

Your `.env` file contains sensitive data:
```env
DB_PASSWORD=your-secret-password     ← NEVER commit this!
JWT_SECRET=your-secret-key           ← NEVER commit this!
API_KEY=secret-api-key               ← NEVER commit this!
```

**Anyone who sees your .env can:**
- ❌ Access your database
- ❌ Forge authentication tokens
- ❌ Access your accounts

### Safe Way to Share Credentials:

1. **Commit `.env.example`** - Template without values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=tasksphere
JWT_SECRET=your-secret-key-here
```

2. **Document setup:**
   - Tell collaborators to copy `.env.example` to `.env`
   - They add their own secret values
   - They NEVER commit `.env`

---

## 📂 Directory Structure in Git

```
tasksphere/
├── .gitignore                    ← Git ignore rules
├── README.md                     ← Main documentation
├── QUICK_START.md                ← Setup guide
├── TROUBLESHOOTING.md            ← Help guide
├── package.json                  ← (optional - root package)
│
├── server/
│   ├── .gitignore                ← Server-specific ignores
│   ├── .env.example              ← ✅ COMMIT THIS
│   ├── .env                       ← ❌ DON'T COMMIT (ignored)
│   ├── package.json              ← ✅ COMMIT
│   ├── package-lock.json         ← ✅ COMMIT
│   ├── setup-database.js         ← ✅ COMMIT
│   ├── server.js                 ← ✅ COMMIT
│   ├── node_modules/             ← ❌ IGNORED
│   ├── config/
│   │   ├── database.js           ← ✅ COMMIT
│   │   └── schema.sql            ← ✅ COMMIT
│   ├── controllers/              ← ✅ COMMIT
│   ├── routes/                   ← ✅ COMMIT
│   ├── models/                   ← ✅ COMMIT
│   └── middleware/               ← ✅ COMMIT
│
└── client/
    ├── .gitignore                ← Client-specific ignores
    ├── package.json              ← ✅ COMMIT
    ├── package-lock.json         ← ✅ COMMIT
    ├── public/                   ← ✅ COMMIT
    ├── src/                      ← ✅ COMMIT
    ├── node_modules/             ← ❌ IGNORED
    └── build/                    ← ❌ IGNORED
```

---

## 🚀 Daily Git Workflow

### After Making Changes:

```bash
# 1. See what changed
git status

# 2. Add specific files
git add server/controllers/authController.js
git add client/src/pages/Login.js

# OR add all changes
git add .

# 3. Commit with message
git commit -m "feat: Add authentication system"

# 4. Push to GitHub
git push origin main
```

### Commit Message Examples:

```bash
# Features
git commit -m "feat: Add task filtering"
git commit -m "feat: Add dark mode toggle"

# Bug fixes
git commit -m "fix: Fix login validation error"
git commit -m "fix: Correct database query in tasks"

# Documentation
git commit -m "docs: Update README setup instructions"
git commit -m "docs: Add troubleshooting guide"

# Refactoring
git commit -m "refactor: Restructure authentication logic"
git commit -m "refactor: Simplify task filtering logic"

# Performance
git commit -m "perf: Optimize database queries"
git commit -m "perf: Reduce bundle size"
```

---

## 🔄 Important Git Commands

```bash
# Check status
git status

# See commit history
git log
git log --oneline              # Short format

# View specific file changes
git diff server/package.json

# View all changes
git diff

# Revert last commit (keep changes)
git reset --soft HEAD~1

# Revert last commit (discard changes)
git reset --hard HEAD~1

# Create a new branch for features
git checkout -b feature/new-feature
git push origin feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# Pull latest changes
git pull origin main

# Stash changes temporarily
git stash
git stash pop
```

---

## ⚠️ NEVER Commit These Files

```
.env                    ← Contains passwords
node_modules/           ← Too large (1000s of files)
build/                  ← Generated, can recreate
dist/                   ← Generated, can recreate
.DS_Store               ← Mac system file
Thumbs.db               ← Windows system file
*.log                   ← Log files
.idea/                  ← IDE settings
.vscode/                ← VS Code settings
```

---

## ✅ ALWAYS Commit These Files

```
src/                    ← Your source code
package.json            ← Dependencies list
package-lock.json       ← Exact versions
.gitignore              ← Git rules
README.md               ← Documentation
.env.example            ← Template (no secrets)
config/schema.sql       ← Database structure
```

---

## 🚨 Oops! I Committed .env

If you accidentally committed `.env`:

```bash
# Remove from Git tracking (keeps local copy)
git rm --cached .env

# Tell Git to ignore it
echo ".env" >> .gitignore

# Commit the fix
git add .gitignore
git commit -m "Remove .env from tracking"

# Push
git push origin main

# ⚠️ Important: Rotate your secrets!
# Change all passwords and keys in .env
# Change JWT_SECRET
# Change database password
# etc.
```

---

## 📊 GitHub Portfolio Tips

### Make Your Repository Stand Out:

1. **Good README:**
   ```markdown
   # TaskSphere
   A full-stack task management application built with React, Node.js, and MySQL.
   ```

2. **Meaningful Commits:**
   - Good: `git commit -m "feat: Add task filtering by priority"`
   - Bad: `git commit -m "updates"`

3. **Regular Pushes:**
   - Commit after each feature
   - Push daily

4. **Branch Strategy:**
   ```bash
   main              ← Production ready
   develop           ← Development
   feature/xxx       ← New features
   bugfix/xxx        ← Bug fixes
   ```

5. **Add License:**
   ```bash
   echo "MIT License" > LICENSE
   git add LICENSE
   git commit -m "Add MIT License"
   ```

---

## 🎓 Learning Resources

- [Git Official Docs](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)
- [GitHub Desktop](https://desktop.github.com) - GUI alternative

---

## 🔑 Summary

| Action | Command |
|--------|---------|
| Initialize repo | `git init` |
| Add changes | `git add .` |
| Commit | `git commit -m "message"` |
| Push to GitHub | `git push origin main` |
| Check status | `git status` |
| View history | `git log --oneline` |
| Create branch | `git checkout -b feature/name` |

---

**Happy committing! 🚀**
