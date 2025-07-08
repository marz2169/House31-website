# House31 - Next.js with ShadCN UI

This project showcases a complete Next.js application with ShadCN UI components and dark mode support.

## 🎉 **ShadCN UI Installation Complete!**

### ✅ **Installed & Configured:**

- **ShadCN UI** with Zinc base color theme
- **Dark mode support** with theme toggle
- **Tailwind CSS 4** integration
- **TypeScript** support

### ✅ **Components Installed:**

- 🎴 **Card** - Beautiful card component with header, content, and description
- 🔘 **Button** - Multiple variants (default, secondary, outline, ghost)
- 👤 **Avatar** - User avatar component with fallback support
- 🧭 **Navigation Menu** - Navigation component for building navbars

### ✅ **Key Features:**

- **Zinc Color Scheme** - Professional, neutral color palette
- **Automatic Dark Mode** - Respects system preferences
- **Theme Toggle** - Manual light/dark mode switching
- **TypeScript Ready** - Full type safety
- **CSS Variables** - Dynamic theming support

### 📁 **Project Structure:**

```
house31/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind + ShadCN styles
│   │   ├── layout.tsx           # Root layout with ThemeProvider
│   │   └── page.tsx             # Demo page showcasing components
│   ├── components/
│   │   ├── ui/                  # ShadCN UI components
│   │   │   ├── card.tsx
│   │   │   ├── button.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── navigation-menu.tsx
│   │   ├── theme-provider.tsx   # Theme context provider
│   │   └── theme-toggle.tsx     # Dark/light mode toggle
│   └── lib/
│       └── utils.ts             # Utility functions (cn)
├── components.json              # ShadCN configuration
└── tailwind.config.js           # Tailwind configuration
```

### 🚀 **Getting Started:**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### 🌙 **Dark Mode:**

- **Automatic**: Follows system color scheme preference
- **Manual**: Use the theme toggle button in the top-right corner
- **Persistent**: Theme preference is saved to localStorage

### 🎨 **Customization:**

The Zinc color scheme provides:
- **Light Mode**: Clean whites and light grays
- **Dark Mode**: Deep charcoal and zinc tones
- **Excellent Contrast**: WCAG compliant color combinations

### 📦 **Dependencies Added:**

```json
{
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-navigation-menu": "^1.2.13", 
  "@radix-ui/react-slot": "^1.2.3",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.525.0",
  "tailwind-merge": "^3.3.1"
}
```

### 🔧 **Configuration Files:**

- **components.json** - ShadCN UI configuration with Zinc theme
- **tailwind.config.js** - Tailwind CSS setup
- **globals.css** - CSS variables for light/dark themes
- **tsconfig.json** - TypeScript with path aliases

The project is ready for development with a complete UI component system!
