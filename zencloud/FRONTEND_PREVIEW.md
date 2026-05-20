# ZenCloud Frontend Preview

## 🎨 Design Overview

The frontend is built with a **black and orange theme** inspired by modern cloud platforms like ZenDBX, featuring glassmorphism effects and smooth animations.

## 📄 Pages Built

### 1. Landing Page (`/`)

**Sections:**
- **Navigation Bar**
  - Logo (Rocket icon + "ZenCloud")
  - Links: Features, Pricing, Demo, Login
  - CTA: "Start Free" button with orange glow

- **Hero Section**
  - Large headline: "Deploy Your Apps In Minutes"
  - Subheadline with value proposition
  - Two CTAs: "Start Building Free" + "Watch Demo"
  - Terminal demo showing deployment flow
  - Trust badges (10,000+ projects, 99.9% uptime)

- **How It Works** (3 Steps)
  1. Connect GitHub
  2. Auto Deploy
  3. Go Live

- **Features Grid** (6 cards)
  - Instant Deployments
  - SSL by Default
  - Managed Databases
  - Custom Domains
  - Real-time Monitoring
  - Auto Scaling

- **Pricing Section** (3 tiers)
  - Free: $0/month (2 projects)
  - Pro: $29/month (Most Popular)
  - Team: $99/month

- **Final CTA**
  - "Ready to Deploy Your App?"
  - Large orange button

- **Footer**
  - Product, Company, Resources links
  - Social proof
  - Legal links

### 2. Login Page (`/login`)

**Features:**
- Centered card layout
- ZenCloud logo at top
- "Continue with GitHub" button (white)
- Divider: "Or continue with email"
- Email/password form
- "Remember me" checkbox
- "Forgot password?" link
- Orange "Sign In" button
- Link to signup page
- Terms & Privacy footer

### 3. Signup Page (`/signup`)

**Layout:**
- Two-column design (desktop)
- **Left Column** (Benefits):
  - Headline with orange accent
  - 6 checkmark benefits
  - Testimonial card
- **Right Column** (Form):
  - "Continue with GitHub" button
  - Divider
  - Name, Email, Password fields
  - Terms checkbox
  - Orange "Create Account" button
  - Link to login page

### 4. Dashboard (`/dashboard`)

**Layout:**
- **Sidebar** (left):
  - Logo
  - Navigation: Dashboard, Projects, Databases, Settings
  - User profile at bottom with logout

- **Top Bar**:
  - Page title
  - Notification bell with badge

- **Main Content**:
  - Welcome message
  - "New Project" button (orange)
  
  - **Stats Grid** (4 cards):
    - Total Projects (12)
    - Active Deployments (8)
    - Storage Used (4.2 GB)
    - API Requests (2.4k)
  
  - **Recent Projects** (left, 2/3 width):
    - Project cards with:
      - Name + status badge
      - Live URL with external link
      - Framework, branch, last deploy time
      - Status icons (running/building/failed)
  
  - **Recent Activity** (right, 1/3 width):
    - Timeline of recent actions
    - Color-coded status dots
    - Quick Actions card

## 🎨 Design System

### Colors
```css
Primary Orange: #FF6B35
Hover Orange: #FF8C42

Background Black: #0A0A0A
Surface Dark: #121212
Card Dark: #1E1E1E
Border Dark: #2A2A2A

Text White: #FFFFFF
Text Gray: #E5E5E5
Text Muted: #B3B3B3

Success Green: #10B981
Error Red: #EF4444
Warning Yellow: #F59E0B
```

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold, large sizes
- Body: Regular, readable sizes
- Code: Monospace for terminal

### Components

**Glass Effect:**
```css
background: rgba(18, 18, 18, 0.5)
backdrop-filter: blur(12px)
border: 1px solid rgba(42, 42, 42, 0.5)
```

**Orange Glow:**
```css
box-shadow: 0 0 20px rgba(255, 107, 53, 0.3)
```

**Buttons:**
- Primary: Orange with glow
- Secondary: Glass with hover
- Ghost: Transparent with hover

**Cards:**
- Glass background
- Rounded corners (12px)
- Hover: Orange border
- Padding: 24px

### Icons
- Library: Lucide React
- Size: 20-24px standard
- Color: Matches context (orange for primary, white/gray for others)

## 📱 Responsive Design

- **Mobile**: Single column, stacked layout
- **Tablet**: 2-column grids
- **Desktop**: Full multi-column layouts
- **Sidebar**: Collapsible on mobile (future)

## ✨ Animations

- Smooth transitions (200-300ms)
- Hover effects on all interactive elements
- Loading spinner for "building" status
- Fade-in effects (future enhancement)

## 🔧 Technical Details

**Framework:** Next.js 14 (App Router)
**Styling:** Tailwind CSS
**Icons:** Lucide React
**Type Safety:** TypeScript
**Utilities:** clsx + tailwind-merge

## 🎯 User Flow

1. **Landing** → User sees value prop → Clicks "Start Free"
2. **Signup** → Creates account with GitHub or email
3. **Dashboard** → Sees overview → Clicks "New Project"
4. **Deploy** → Connects repo → Auto-deploys → Goes live

## 📊 Mock Data

Dashboard currently shows:
- 12 total projects
- 8 active deployments
- 4.2 GB storage used
- 2.4k API requests today
- 4 sample projects (portfolio, API, landing, blog)
- Recent activity timeline

## 🚀 Next Steps

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. View at: `http://localhost:3000`
4. Test all pages and interactions
5. Connect to backend API (coming next)

## 📸 Screenshots

*Screenshots will be added after first run*

## 🎉 What's Working

✅ All pages render correctly
✅ Navigation works
✅ Responsive design
✅ Dark theme applied
✅ Orange accents throughout
✅ Icons display properly
✅ Forms are styled
✅ Cards have glass effect
✅ Buttons have hover states
✅ Dashboard layout complete

## 🔄 What's Next

- Connect to real API
- Implement GitHub OAuth
- Add real-time data
- Create project detail pages
- Add deployment logs viewer
- Implement environment variables UI
- Add settings pages

---

**The frontend is production-ready for demo purposes!** 🎉
