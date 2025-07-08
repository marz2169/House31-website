# CSS Warnings Fix for Tailwind CSS

This document explains how CSS warnings related to Tailwind CSS directives have been suppressed in this project.

## Problem

When using Tailwind CSS with VS Code, you may encounter warnings like:

```
Unknown at rule @tailwind
```

These warnings appear because standard CSS linting doesn't recognize Tailwind's custom at-rules.

## Solutions Implemented

### 1. VS Code Settings

In `.vscode/settings.json`:
- Disabled CSS validation with `"css.validate": false`
- Set file associations to recognize CSS files as Tailwind CSS
- Added custom CSS data for Tailwind directives

### 2. CSS Custom Data

Created `.vscode/css-custom-data.json` to teach VS Code about Tailwind directives:
- `@tailwind`
- `@apply`
- `@layer`
- `@config`

### 3. StyleLint Configuration

Added `.stylelintrc.json` to:
- Ignore specific Tailwind at-rules
- Completely ignore `globals.css` for linting

### 4. Inline Comments

Added inline comments to disable linting for Tailwind directives:

```css
/* stylelint-disable-next-line at-rule-no-unknown */
@tailwind base;
```

## Additional Recommendations

1. **Install Recommended Extensions**:
   - Tailwind CSS IntelliSense
   - PostCSS Language Support
   - StyleLint

2. **Reload VS Code** after making these changes for them to take effect.

3. **Consider PostCSS Plugin** for your editor if you still see warnings.

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs/functions-and-directives)
- [VS Code CSS Validation Documentation](https://code.visualstudio.com/docs/languages/css#_syntax-verification-linting)
- [Stylelint Documentation](https://stylelint.io/user-guide/configure)
