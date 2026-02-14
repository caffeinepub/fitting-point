import { useState, useEffect } from 'react';
import { useGetSiteContent } from './useSiteContent';

const THEME_STORAGE_KEY = 'fitting_point_theme_override';

export function useThemeMode() {
  const { data: siteContent } = useGetSiteContent();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for user override first
    const userOverride = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null;
    
    if (userOverride) {
      setTheme(userOverride);
      applyTheme(userOverride);
    } else if (siteContent) {
      // Use admin default
      const defaultTheme = siteContent.darkModeEnabled ? 'dark' : 'light';
      setTheme(defaultTheme);
      applyTheme(defaultTheme);
    }
  }, [siteContent]);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return {
    theme,
    toggleTheme,
  };
}
