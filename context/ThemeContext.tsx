import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of your theme
interface Theme {
  bgColor: string;
  textColor: string;
  hintColor: string;
  buttonColor: string;
  buttonTextColor: string;
  secondaryBgColor: string;
  sectionBgColor: string;
  accentTextColor: string;
}

// Create the context with a default value
const ThemeContext = createContext<{
  theme: Theme;
}>({
  theme: {
    bgColor: '#fff',
    textColor: '#000',
    hintColor: '#999',
    buttonColor: '#0088cc',
    buttonTextColor: '#fff',
    secondaryBgColor: '#f4f4f5',
    sectionBgColor: '#ffffff',
    accentTextColor: '#3390ec',
  },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>({
    bgColor: '#fff',
    textColor: '#000',
    hintColor: '#999',
    buttonColor: '#0088cc',
    buttonTextColor: '#fff',
    secondaryBgColor: '#f4f4f5',
    sectionBgColor: '#ffffff',
    accentTextColor: '#3390ec',
  });

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (tg) {
      const {
        bg_color,
        text_color,
        hint_color,
        button_color,
        button_text_color,
        secondary_bg_color,
        section_bg_color,
        accent_text_color,
      } = tg.themeParams;
      setTheme({
        bgColor: bg_color || '#fff',
        textColor: text_color || '#000',
        hintColor: hint_color || '#999',
        buttonColor: button_color || '#0088cc',
        buttonTextColor: button_text_color || '#fff',
        secondaryBgColor: secondary_bg_color || '#f4f4f5',
        sectionBgColor: section_bg_color || '#ffffff',
        accentTextColor: accent_text_color || '#3390ec',
      });
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);
