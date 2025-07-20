import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";

interface GradientStop {
  offset: number; // 0 ~ 1
  color: string;  // 16進位色碼
}

export interface MyGradient {
  enabled: boolean;
  from: string;
  to: string;
  angle: number;
  stops: GradientStop[];
  type?: 'linear' | 'radial' | 'repeating-linear';
}

export interface ColorPart {
  color: string;
  gradient: MyGradient;
}

export interface ThemeColors {
  sidebar: ColorPart;
  topbar: ColorPart;
  box: ColorPart;
  boxBackground: ColorPart;
  text: ColorPart;
  title: ColorPart;
  background: ColorPart;
}

interface ThemeContextType {
  themeColors: ThemeColors;
  setThemeColors: React.Dispatch<React.SetStateAction<ThemeColors>>;
}

const defaultColor = "#ffffff";

const createDefaultGradient = (baseColor: string): MyGradient => ({
  enabled: false,
  from: baseColor,
  to: baseColor,
  angle: 90,
  stops: [
    { offset: 0, color: baseColor },
    { offset: 1, color: baseColor },
  ],
});

const defaultColors: ThemeColors = {
  sidebar: { color: defaultColor, gradient: createDefaultGradient(defaultColor) },
  topbar: { color: defaultColor, gradient: createDefaultGradient(defaultColor) },
  box: { color: defaultColor, gradient: createDefaultGradient(defaultColor) },
  boxBackground: { color: defaultColor, gradient: createDefaultGradient(defaultColor) },
  text: { color: defaultColor, gradient: createDefaultGradient(defaultColor) },
  title: { color: defaultColor, gradient: createDefaultGradient(defaultColor) },
  background: { color: defaultColor, gradient: createDefaultGradient(defaultColor) },
};

const getInitialThemeColors = (): ThemeColors => {
  const saved = Cookies.get("themeColors");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (err) {
      console.warn("⚠️ Failed to parse themeColors cookie:", err);
    }
  }
  return defaultColors;
};

const ThemeContext = createContext<ThemeContextType>({
  themeColors: defaultColors,
  setThemeColors: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

// 背景樣式轉換
export function getColorCss(colorPart: ColorPart): string {
  if (!colorPart) return "#ffffff";

  const { gradient } = colorPart;

  if (gradient?.enabled && gradient.stops.length >= 2) {
    const stopsStr = gradient.stops
      .map((stop) => `${stop.color} ${Math.round(stop.offset * 100)}%`)
      .join(', ');

    switch (gradient.type) {
      case 'radial':
        return `radial-gradient(circle, ${stopsStr})`;
      case 'repeating-linear':
        return `repeating-linear-gradient(${gradient.angle}deg, ${stopsStr})`;
      case 'linear':
      default:
        return `linear-gradient(${gradient.angle}deg, ${stopsStr})`;
    }
  }

  return colorPart.color;
}

export const ThemeProviderCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColors, setThemeColors] = useState<ThemeColors>(getInitialThemeColors);

  // 動態建立 MUI 主題，包含背景與文字
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: themeColors.sidebar.color,
          },
          background: {
            default: themeColors.background.color,
          },
          text: {
            primary: themeColors.text.color,
          },
        },
      }),
    [themeColors]
  );

  return (
    <ThemeContext.Provider value={{ themeColors, setThemeColors }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
