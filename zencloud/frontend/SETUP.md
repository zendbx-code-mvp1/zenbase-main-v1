# ZenCloud Frontend Setup Guide

## Quick Start

### 1. Install Node.js
Make sure you have Node.js 18+ installed:
```bash
node --version
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## Available Pages

- **Landing**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup
- **Dashboard**: http://localhost:3000/dashboard

## PowerShell Execution Policy Issue

If you encounter "running scripts is disabled" error on Windows:

### Option 1: Run in CMD instead
```cmd
npm run dev
```

### Option 2: Change PowerShell policy (Admin required)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Option 3: Use npx directly
```bash
node node_modules/next/dist/bin/next dev
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Development Tips

1. **Hot Reload**: Changes auto-refresh in browser
2. **TypeScript**: Check types with `npm run build`
3. **Linting**: Run `npm run lint` to check code quality
4. **Tailwind**: Use Tailwind IntelliSense VSCode extension

## Next Steps

1. ✅ Frontend is running
2. 🔄 Build backend API (FastAPI)
3. 🔄 Connect GitHub OAuth
4. 🔄 Implement deployment features
5. 🔄 Add real-time logs

## Need Help?

- Check console for errors (F12 in browser)
- Review Next.js docs: https://nextjs.org/docs
- Check Tailwind docs: https://tailwindcss.com/docs
