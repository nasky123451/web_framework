import React, { createContext, useContext, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";

interface GradientStop {
  offset: number; // 0 ~ 1
  color: string;  // 16進位色碼
}

export interface MyGradient {
  enabled: boolean;
  angle: number;
  stops: GradientStop[];
}

export interface ColorPart {
  color: string;
  gradient: MyGradient;
}

export interface ThemeColors {
  sidebar: ColorPart;
  topbar: ColorPart;
  box: ColorPart;
}

interface ThemeContextType {
  themeColors: ThemeColors;
  setThemeColors: React.Dispatch<React.SetStateAction<ThemeColors>>;
}

const defaultColor = "#1976d2";

const defaultColors: ThemeColors = {
  sidebar: {
    color: defaultColor,
    gradient: { enabled: false, angle: 90, stops: [{ offset: 0, color: defaultColor }] },
  },
  topbar: {
    color: defaultColor,
    gradient: { enabled: false, angle: 90, stops: [{ offset: 0, color: defaultColor }] },
  },
  box: {
    color: defaultColor,
    gradient: { enabled: false, angle: 90, stops: [{ offset: 0, color: defaultColor }] },
  },
};

const ThemeContext = createContext<ThemeContextType>({
  themeColors: defaultColors,
  setThemeColors: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProviderCustom: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultColors);

  useEffect(() => {
    const saved = Cookies.get("themeColors");
    if (saved) {
      try {
        setThemeColors(JSON.parse(saved));
      } catch {
        // JSON parse fail, keep default
      }
    }
  }, []);

  useEffect(() => {
    Cookies.set("themeColors", JSON.stringify(themeColors), { expires: 365 });
  }, [themeColors]);

  const theme = createTheme({
    palette: {
      primary: {
        main: themeColors.sidebar.color,
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ themeColors, setThemeColors }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
