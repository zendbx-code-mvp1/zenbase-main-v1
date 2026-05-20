# ZenCloud Frontend

Modern, dark-themed frontend for ZenCloud deployment platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Theme

- **Colors**: Black & Orange
- **Primary**: Orange (#FF6B35)
- **Background**: Deep Black (#0A0A0A, #121212)
- **Design**: Glassmorphism, modern cards, smooth animations

## Features

- ✅ Landing page with hero, features, pricing
- ✅ Login/Signup pages with GitHub OAuth
- ✅ Dashboard with project overview
- ✅ Real-time stats and activity feed
- ✅ Responsive design
- ✅ Dark theme optimized

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Login page
│   ├── signup/page.tsx       # Signup page
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   └── page.tsx          # Dashboard home
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── lib/
│   └── utils.ts              # Utility functions
├── tailwind.config.ts        # Tailwind configuration
└── package.json
```

## Pages

### Landing Page (`/`)
- Hero section with CTA
- Trust badges
- How it works (3 steps)
- Features grid
- Pricing cards
- Footer

### Login (`/login`)
- GitHub OAuth button
- Email/password form
- Remember me checkbox
- Forgot password link

### Signup (`/signup`)
- Benefits sidebar
- GitHub OAuth button
- Registration form
- Terms acceptance

### Dashboard (`/dashboard`)
- Sidebar navigation
- Stats overview (4 cards)
- Recent projects list
- Activity feed
- Quick actions

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

## Color Palette

```css
Primary Orange: #FF6B35
Dark Backgrounds: #0A0A0A, #121212, #1E1E1E
Text: #FFFFFF, #E5E5E5, #B3B3B3
Success: #10B981
Error: #EF4444
```

## Custom Styles

### Glass Effect
```tsx
<div className="glass">
  // Glassmorphism card
</div>
```

### Orange Glow
```tsx
<button className="glow-orange">
  // Button with orange shadow
</button>
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Next Steps

1. Connect to backend API
2. Implement GitHub OAuth flow
3. Add real-time WebSocket for logs
4. Create project detail pages
5. Add deployment management UI
6. Implement environment variables UI

## License

MIT
