import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="rounded-full w-9 h-9 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      {theme === 'light' ? (
        <Icon icon="mdi:moon-waning-crescent" className="h-5 w-5" />
      ) : (
        <Icon icon="mdi:white-balance-sunny" className="h-5 w-5" />
      )}
    </Button>
  );
}
