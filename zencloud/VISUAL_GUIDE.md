# ZenCloud Visual Design Guide

## 🎨 Design System

### Color Palette

#### Primary Colors
```
Orange 500 (Primary):    #FF6B35  ███████  Main CTAs, accents
Orange 600 (Hover):      #ea580c  ███████  Button hover states
Orange 400:              #fb923c  ███████  Lighter accents
```

#### Background Colors
```
Dark 950 (Background):   #0A0A0A  ███████  Main background
Dark 900 (Surface):      #121212  ███████  Card backgrounds
Dark 800 (Input):        #1E1E1E  ███████  Form inputs
Dark 700 (Border):       #2A2A2A  ███████  Borders, dividers
```

#### Text Colors
```
White (Primary):         #FFFFFF  ███████  Headings, important text
Gray 300 (Secondary):    #E5E5E5  ███████  Body text
Gray 400 (Muted):        #B3B3B3  ███████  Subtle text
Gray 500 (Disabled):     #737373  ███████  Disabled states
```

#### Status Colors
```
Green 500 (Success):     #10B981  ███████  Running, success
Red 500 (Error):         #EF4444  ███████  Failed, errors
Yellow 500 (Warning):    #F59E0B  ███████  Building, warnings
Blue 500 (Info):         #3B82F6  ███████  Information
```

### Typography

#### Font Family
```
Primary: Inter (Google Fonts)
Fallback: system-ui, sans-serif
Code: monospace
```

#### Font Sizes
```
Hero:        text-7xl (72px)  - Main headlines
H1:          text-5xl (48px)  - Page titles
H2:          text-4xl (36px)  - Section headers
H3:          text-2xl (24px)  - Card titles
H4:          text-xl (20px)   - Subsections
Body Large:  text-lg (18px)   - Important text
Body:        text-base (16px) - Default text
Small:       text-sm (14px)   - Secondary text
Tiny:        text-xs (12px)   - Captions, labels
```

#### Font Weights
```
Bold:        font-bold (700)      - Headlines, CTAs
Semibold:    font-semibold (600)  - Buttons, labels
Medium:      font-medium (500)    - Emphasis
Regular:     font-normal (400)    - Body text
```

### Spacing

#### Padding/Margin Scale
```
xs:  4px   (p-1)   - Tight spacing
sm:  8px   (p-2)   - Small spacing
md:  16px  (p-4)   - Default spacing
lg:  24px  (p-6)   - Card padding
xl:  32px  (p-8)   - Section padding
2xl: 48px  (p-12)  - Large sections
```

#### Component Spacing
```
Card Padding:        24px (p-6)
Button Padding:      12px 24px (py-3 px-6)
Input Padding:       12px 16px (py-3 px-4)
Section Padding:     80px 16px (py-20 px-4)
```

### Border Radius

```
Small:    4px   (rounded)      - Badges, small elements
Medium:   8px   (rounded-lg)   - Buttons, inputs
Large:    12px  (rounded-xl)   - Cards
XLarge:   16px  (rounded-2xl)  - Large cards
Full:     9999px (rounded-full) - Pills, avatars
```

### Shadows & Effects

#### Glass Effect
```css
background: rgba(18, 18, 18, 0.5);
backdrop-filter: blur(12px);
border: 1px solid rgba(42, 42, 42, 0.5);
```

#### Orange Glow
```css
box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
```

#### Card Shadow
```css
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Animations

#### Transitions
```
Fast:     150ms  - Hover states
Default:  200ms  - Most interactions
Slow:     300ms  - Complex animations
```

#### Hover Effects
```
Buttons:  Scale + brightness
Cards:    Border color change
Links:    Color change
Icons:    Rotate or scale
```

## 🧩 Component Patterns

### Button Variants

#### Primary Button
```
Background: Orange 500
Hover: Orange 600
Text: White
Effect: Orange glow
Use: Main actions (Deploy, Sign Up, Create)
```

#### Secondary Button
```
Background: Glass effect
Hover: Dark 800
Text: White
Border: Dark 700
Use: Alternative actions (Cancel, View, Learn More)
```

#### Ghost Button
```
Background: Transparent
Hover: Dark 800
Text: Gray 400 → White
Use: Subtle actions (Edit, Delete, Settings)
```

### Card Styles

#### Standard Card
```
Background: Glass effect
Border: Dark 700
Padding: 24px
Radius: 12px
Use: Content containers
```

#### Hover Card
```
Standard Card +
Hover Border: Orange 500 (50% opacity)
Cursor: Pointer
Use: Clickable items (projects, features)
```

#### Highlighted Card
```
Background: Orange 500 (10% opacity)
Border: Orange 500 (50% opacity)
Use: Featured items, active states
```

### Status Badges

#### Running (Success)
```
Background: Green 500 (10% opacity)
Border: Green 500 (20% opacity)
Text: Green 500
Icon: CheckCircle
```

#### Building (Warning)
```
Background: Yellow 500 (10% opacity)
Border: Yellow 500 (20% opacity)
Text: Yellow 500
Icon: Loader (spinning)
```

#### Failed (Error)
```
Background: Red 500 (10% opacity)
Border: Red 500 (20% opacity)
Text: Red 500
Icon: XCircle
```

#### Pending (Info)
```
Background: Blue 500 (10% opacity)
Border: Blue 500 (20% opacity)
Text: Blue 500
Icon: AlertCircle
```

### Form Elements

#### Text Input
```
Background: Dark 800
Border: Dark 700
Focus Border: Orange 500
Text: White
Placeholder: Gray 500
Padding: 12px 16px
Radius: 8px
```

#### Textarea
```
Same as Text Input
Min Height: 100px
Resize: Vertical
```

#### Checkbox/Radio
```
Background: Dark 800
Border: Dark 700
Checked: Orange 500
Size: 20px
```

## 📐 Layout Patterns

### Page Structure
```
┌─────────────────────────────────┐
│         Navigation Bar          │ 64px height
├─────────────────────────────────┤
│                                 │
│         Hero Section            │ Variable
│                                 │
├─────────────────────────────────┤
│                                 │
│       Content Sections          │ 80px padding
│                                 │
├─────────────────────────────────┤
│           Footer                │ Variable
└─────────────────────────────────┘
```

### Dashboard Layout
```
┌──────────┬──────────────────────┐
│          │     Top Bar          │ 64px height
│          ├──────────────────────┤
│ Sidebar  │                      │
│ 256px    │   Main Content       │
│          │   Padding: 32px      │
│          │                      │
└──────────┴──────────────────────┘
```

### Grid Layouts

#### Features Grid (Desktop)
```
3 columns
Gap: 24px
Min width: 300px
```

#### Stats Grid (Desktop)
```
4 columns
Gap: 24px
Equal width
```

#### Pricing Cards (Desktop)
```
3 columns
Gap: 32px
Max width: 400px each
```

### Responsive Breakpoints
```
Mobile:   < 640px   (1 column)
Tablet:   640-1024px (2 columns)
Desktop:  > 1024px   (3-4 columns)
```

## 🎯 Usage Guidelines

### When to Use Primary Orange

✅ **Use for:**
- Main CTAs (Sign Up, Deploy, Create)
- Active navigation items
- Important icons
- Status indicators (success)
- Links and accents

❌ **Don't use for:**
- Body text
- Large backgrounds
- Multiple elements on same screen
- Disabled states

### When to Use Glass Effect

✅ **Use for:**
- Cards and containers
- Navigation bars
- Modals and overlays
- Sidebar backgrounds

❌ **Don't use for:**
- Text containers
- Form inputs
- Small elements
- Nested cards

### Accessibility

#### Color Contrast
```
White on Dark 950:     21:1 ✅ (Excellent)
Orange 500 on Dark 950: 5.2:1 ✅ (Good)
Gray 400 on Dark 950:   4.8:1 ✅ (Good)
```

#### Focus States
```
All interactive elements have visible focus
Focus ring: Orange 500 with 2px offset
```

#### Text Sizes
```
Minimum body text: 16px
Minimum UI text: 14px
Line height: 1.5 for body, 1.2 for headings
```

## 🖼️ Visual Examples

### Landing Page Hero
```
┌─────────────────────────────────────┐
│                                     │
│     Deploy Your Apps In Minutes     │ ← 72px, Bold, White
│                                     │
│  Push Code → Deploy → Go Live       │ ← 20px, Gray 400
│                                     │
│  [Start Building Free →]            │ ← Orange button with glow
│  [Watch Demo]                       │ ← Glass button
│                                     │
└─────────────────────────────────────┘
```

### Dashboard Stats Card
```
┌──────────────────────────┐
│  [Icon]                  │ ← Orange icon in light bg
│                          │
│  12                      │ ← 32px, Bold, White
│  Total Projects          │ ← 14px, Gray 400
│  +2 this month           │ ← 12px, Gray 500
└──────────────────────────┘
```

### Project Card
```
┌────────────────────────────────────┐
│  my-portfolio        [Running]     │ ← Title + Badge
│  my-portfolio.zencloud.dev ↗       │ ← URL + Icon
│                                    │
│  [Rocket] Next.js  [Branch] main   │ ← Metadata
│  [Clock] 2 hours ago               │
└────────────────────────────────────┘
```

## 🎨 Design Principles

1. **Simplicity First** - Clean, uncluttered layouts
2. **Consistency** - Same patterns throughout
3. **Hierarchy** - Clear visual importance
4. **Feedback** - Hover states, transitions
5. **Accessibility** - Readable, navigable
6. **Performance** - Fast, smooth animations

## 📱 Responsive Behavior

### Mobile (< 640px)
- Single column layouts
- Stacked navigation
- Full-width buttons
- Larger touch targets (44px min)
- Simplified spacing

### Tablet (640-1024px)
- 2-column grids
- Sidebar collapses to menu
- Medium spacing
- Balanced layouts

### Desktop (> 1024px)
- Multi-column grids
- Full sidebar visible
- Generous spacing
- Optimal reading width (max 1280px)

---

**This guide ensures consistent, beautiful design across all ZenCloud pages!** 🎨
