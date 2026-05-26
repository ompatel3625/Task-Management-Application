# ⚡ Git Quick Setup Cheatsheet

## 🚀 Setup Git in 5 Minutes

```bash
# 1. Navigate to project
cd tasksphere

# 2. Initialize git
git init

# 3. Add all files (respects .gitignore)
git add .

# 4. Create initial commit
git commit -m "Initial commit: TaskSphere full-stack application"

# 5. Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/tasksphere.git

# 6. Rename branch to main
git branch -M main

# 7. Push to GitHub
git push -u origin main
```

## 📋 .gitignore Files Added

Three `.gitignore` files are now included:

1. **Root .gitignore** (`tasksphere/.gitignore`)
   - Covers entire project
   - Ignores node_modules, .env, build/, etc.

2. **Server .gitignore** (`tasksphere/server/.gitignore`)
   - Backend-specific ignores
   - Ignores .env, node_modules, logs

3. **Client .gitignore** (`tasksphere/client/.gitignore`)
   - Frontend-specific ignores
   - Ignores node_modules, build, dist

## ✅ What Gets Tracked

These files WILL be on GitHub:
```
✅ package.json
✅ package-lock.json
✅ .gitignore
✅ .env.example (template, no secrets!)
✅ README.md
✅ QUICK_START.md
✅ GIT_GUIDE.md
✅ All source code (src/, controllers/, routes/, etc.)
✅ Database schema (config/schema.sql)
```

## ❌ What Gets Ignored

These files WON'T be on GitHub:
```
❌ .env (your secrets!)
❌ node_modules/ (too large)
❌ build/ (generated)
❌ dist/ (generated)
❌ .DS_Store (Mac files)
❌ Thumbs.db (Windows files)
❌ *.log (log files)
❌ .idea/, .vscode/ (IDE settings)
```

## 🔄 Daily Workflow

```bash
# See changes
git status

# Add changes
git add .

# Commit
git commit -m "feat: Add new feature"

# Push to GitHub
git push origin main
```

## 🛡️ Protect Your Secrets

**BEFORE pushing to GitHub:**

1. Make sure `.env` is NOT committed:
```bash
git status  # Should NOT show .env
```

2. Create `.env.example` with template:
```bash
# .env.example (commit this!)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
JWT_SECRET=your_secret_key_here
```

3. Never commit `.env`:
```bash
echo ".env" >> .gitignore  # Already done!
git add .gitignore
git commit -m "Ensure .env is ignored"
```

## 🆘 Oops! I Committed .env

If you accidentally push `.env`:

```bash
# Remove from Git (keeps local copy)
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from tracking"

# Push
git push origin main

# ⚠️ CHANGE ALL PASSWORDS!
# Edit .env with new secure values
```

## 📚 Commit Message Format

Good commit messages:
```bash
git commit -m "feat: Add task filtering by priority"
git commit -m "fix: Correct login validation"
git commit -m "docs: Update README"
git commit -m "refactor: Simplify task service"
```

Bad commit messages:
```bash
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "changes"
```

## 🎯 Portfolio Tips

1. **Make README shine:**
   - Add badges
   - Add screenshots
   - List features
   - Add setup instructions

2. **Good commit history:**
   - Regular commits
   - Clear messages
   - Logical grouping

3. **Add LICENSE:**
```bash
echo "MIT License - [Your Name]" > LICENSE
git add LICENSE
git commit -m "Add MIT License"
```

4. **Pin important files:**
   - README.md
   - QUICK_START.md
   - GIT_GUIDE.md

## 📊 File Locations

```
tasksphere/
├── .gitignore              ← Main ignore rules
├── GIT_GUIDE.md            ← Full guide (this file)
├── QUICK_START.md
├── TROUBLESHOOTING.md
│
├── server/
│   ├── .gitignore          ← Server-specific rules
│   ├── .env.example        ← Commit this (no secrets)
│   ├── .env                ← Don't commit (has secrets)
│   └── ...
│
└── client/
    ├── .gitignore          ← Client-specific rules
    └── ...
```

## ✨ First Push Checklist

- [ ] Git initialized: `git init`
- [ ] .gitignore files in place
- [ ] .env created (from .env.example)
- [ ] All changes staged: `git add .`
- [ ] Commit created: `git commit -m "..."`
- [ ] GitHub repo created
- [ ] Remote added: `git remote add origin ...`
- [ ] Pushed to GitHub: `git push -u origin main`

## 🔗 Useful Links

- Create GitHub repo: https://github.com/new
- Generate token: https://github.com/settings/tokens
- Git docs: https://git-scm.com/doc
- Conventional commits: https://www.conventionalcommits.org

---

**Ready to push? You've got this! 🚀**
