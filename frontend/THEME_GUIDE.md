# Theme Implementation Guide for House31 Website

This guide explains the theme implementation in the House31 website, including dark mode support, theming patterns, and usage.

## Overview

The House31 website now supports both light and dark themes with a smooth transition between them. The implementation uses:

1. React Context for global theme state management
2. CSS variables and Tailwind CSS for styling
3. Local storage for theme persistence
4. System preference detection for the initial theme

## Components

### ThemeProvider

Located in `src/components/ThemeProvider.tsx`, this component:

- Creates a React context to manage theme state
- Detects system color scheme preferences
- Persists theme selection in localStorage
- Provides a `useTheme` hook for components to consume

Usage:
```tsx
// In App.tsx
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

// In any component
import { useTheme } from '@/components/ThemeProvider';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      Current theme: {theme}
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
    </div>
  );
}
```

### ThemeToggle

Located in `src/components/ThemeToggle.tsx`, this component:

- Provides a button to toggle between light and dark themes
- Shows appropriate icons based on the current theme
- Uses proper accessibility attributes

## CSS Implementation

The theme uses CSS variables defined in `src/index.css` to handle theme colors. The variables are defined under `:root` for light mode and `.dark` for dark mode.

Tailwind CSS is configured to use these variables through the `darkMode: 'class'` setting, allowing the use of `dark:` prefix in class names.

## Transition Effects

Theme transitions are implemented with:

```css
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

This provides a smooth animation when switching between light and dark modes.

## Usage Guidelines

### Adding Theme Support to Components

To make a component theme-aware:

1. Use Tailwind's `dark:` prefix for dark mode styles:

```tsx
<div className="bg-white text-black dark:bg-black dark:text-white">
  Theme aware content
</div>
```

2. Use themed utility classes:

```tsx
<div className="bg-background text-foreground">
  Theme aware content
</div>
```

### Best Practices

1. Always provide both light and dark mode styles
2. Ensure sufficient contrast in both themes
3. Test components in both light and dark modes
4. Use CSS variables for custom components
5. Avoid hardcoded color values
