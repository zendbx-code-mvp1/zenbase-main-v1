# ZenCloud Frontend - Installation Guide

## 🎯 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0 or higher
- **npm** (comes with Node.js)
- **Git** (optional, for version control)
- **Code Editor** (VS Code recommended)

---

## ✅ Check Your System

### Verify Node.js Installation
```bash
node --version
# Should show: v18.x.x or higher
```

### Verify npm Installation
```bash
npm --version
# Should show: 9.x.x or higher
```

### If Node.js is Not Installed
Download from: https://nodejs.org/
- Choose LTS (Long Term Support) version
- Run installer
- Restart terminal after installation

---

## 🚀 Installation Methods

### Method 1: Quick Start (Windows)
**Easiest method - recommended for beginners**

1. Open the project folder
2. Double-click `start-frontend.bat`
3. Wait for installation and server start
4. Visit http://localhost:3000

### Method 2: Command Line (All Platforms)
**Standard method - works everywhere**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Method 3: Using CMD (Windows - if PowerShell issues)
**Alternative for Windows users**

```cmd
cd frontend
npm install
npm run dev
```

### Method 4: Using Bash (Linux/Mac)
**For Unix-based systems**

```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Troubleshooting

### Issue 1: PowerShell Script Execution Error

**Error Message:**
```
npx : File C:\Program Files\nodejs\npx.ps1 cannot be loaded because 
running scripts is disabled on this system.
```

**Solutions:**

#### Option A: Use CMD Instead
```cmd
# Open Command Prompt (not PowerShell)
cd frontend
npm install
npm run dev
```

#### Option B: Change PowerShell Policy (Admin Required)
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Option C: Use Node Directly
```bash
cd frontend
npm install
node node_modules/next/dist/bin/next dev
```

### Issue 2: Port 3000 Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

#### Option A: Kill Process on Port 3000
```bash
# Windows
npx kill-port 3000

# Linux/Mac
lsof -ti:3000 | xargs kill
```

#### Option B: Use Different Port
```bash
npm run dev -- -p 3001
# Then visit: http://localhost:3001
```

### Issue 3: Module Not Found Errors

**Error Message:**
```
Error: Cannot find module 'next'
```

**Solution:**
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: npm Command Not Found

**Error Message:**
```
'npm' is not recognized as an internal or external command
```

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal
3. Verify: `node --version`

### Issue 5: Permission Denied (Linux/Mac)

**Error Message:**
```
EACCES: permission denied
```

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Issue 6: Network/Proxy Issues

**Error Message:**
```
npm ERR! network request failed
```

**Solutions:**

#### Option A: Clear npm Cache
```bash
npm cache clean --force
npm install
```

#### Option B: Use Different Registry
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

#### Option C: Disable Strict SSL (Not Recommended)
```bash
npm config set strict-ssl false
npm install
```

### Issue 7: Build Errors

**Error Message:**
```
Error: Build failed
```

**Solution:**
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

---

## 📦 Manual Installation Steps

If automated methods fail, follow these steps:

### Step 1: Navigate to Frontend
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

**Expected Output:**
```
added 350 packages in 45s
```

### Step 3: Verify Installation
```bash
# Check if node_modules exists
ls node_modules
# Should show many folders
```

### Step 4: Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
> zencloud-frontend@0.1.0 dev
> next dev

  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### Step 5: Open Browser
Visit: http://localhost:3000

---

## 🌐 Accessing the Application

Once the server is running:

### Main Pages
- **Landing**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup
- **Dashboard**: http://localhost:3000/dashboard
- **Components**: http://localhost:3000/components-demo

### Network Access
To access from other devices on your network:

1. Find your IP address:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. Use IP instead of localhost:
   ```
   http://192.168.1.x:3000
   ```

---

## 🔍 Verification Checklist

After installation, verify everything works:

- [ ] Server starts without errors
- [ ] Landing page loads at http://localhost:3000
- [ ] Navigation works (click links)
- [ ] Login page displays correctly
- [ ] Signup page displays correctly
- [ ] Dashboard loads with sidebar
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal
- [ ] Hot reload works (edit a file and see changes)

---

## 🛠️ Development Tools

### Recommended VS Code Extensions
```
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
```

### Install Extensions
1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows) or `Cmd+Shift+X` (Mac)
3. Search for extension name
4. Click Install

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## 📝 Environment Variables

### Create .env.local
```bash
cd frontend
cp .env.example .env.local
```

### Edit .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

**Note:** These are for future backend integration.

---

## 🚦 Available Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Useful Commands
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Install specific package
npm install package-name
```

---

## 🐛 Common Issues & Solutions

### Issue: Changes Not Reflecting
**Solution:** Hard refresh browser
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### Issue: Slow Installation
**Solution:** Use faster registry
```bash
npm config set registry https://registry.npmmirror.com
```

### Issue: TypeScript Errors
**Solution:** Restart TypeScript server
- VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Issue: Tailwind Classes Not Working
**Solution:** Restart dev server
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 📊 System Requirements

### Minimum
- **CPU**: Dual-core processor
- **RAM**: 4 GB
- **Disk**: 500 MB free space
- **OS**: Windows 10, macOS 10.15, Ubuntu 20.04

### Recommended
- **CPU**: Quad-core processor
- **RAM**: 8 GB or more
- **Disk**: 1 GB free space
- **OS**: Latest version

---

## 🎓 Next Steps

After successful installation:

1. ✅ Explore all pages
2. ✅ Check responsive design (resize browser)
3. ✅ Open browser console (F12) - should be no errors
4. ✅ Try editing a file - changes should auto-reload
5. ✅ Read `FRONTEND_PREVIEW.md` for design details
6. ✅ Review `DEVELOPMENT_PLAN.md` for roadmap
7. ✅ Start building backend (next phase)

---

## 📞 Getting Help

### Documentation
- **QUICK_START.md** - Quick start guide
- **frontend/SETUP.md** - Setup troubleshooting
- **FRONTEND_PREVIEW.md** - Design documentation
- **VISUAL_GUIDE.md** - Design system

### External Resources
- Next.js Docs: https://nextjs.org/docs
- Tailwind Docs: https://tailwindcss.com/docs
- Node.js Help: https://nodejs.org/en/docs/

### Debug Mode
Run with verbose logging:
```bash
npm run dev -- --debug
```

---

## ✅ Success!

If you see this in your browser:
- Black background
- Orange "Start Free" button with glow
- "Deploy Your Apps In Minutes" headline
- Smooth animations

**You're ready to go!** 🎉

---

**Installation complete! Time to build the backend.** 🚀
