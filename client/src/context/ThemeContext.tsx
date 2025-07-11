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
}

export interface ColorPart {
  color: string;
  gradient: MyGradient;
}

export interface ThemeColors {
  sidebar: ColorPart;
  topbar: ColorPart;
  box: ColorPart;
  text: ColorPart;
  background: ColorPart;
}

interface ThemeContextType {
  themeColors: ThemeColors;
  setThemeColors: React.Dispatch<React.SetStateAction<ThemeColors>>;
}

const defaultColor = "#1976d2";

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
  text: { color: defaultColor, gradient: createDefaultGradient(defaultColor) },
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
export function getBackgroundCss(colorPart: ColorPart): string {
  if (colorPart.gradient.enabled) {
    const g = colorPart.gradient;
    const fromColor = g.stops[0]?.color ?? g.from ?? colorPart.color;
    const toColor = g.stops[g.stops.length - 1]?.color ?? g.to ?? colorPart.color;
    return `linear-gradient(${g.angle}deg, ${fromColor}, ${toColor})`;
  }
  return colorPart.color;
}

export const ThemeProviderCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColors, setThemeColors] = useState<ThemeColors>(getInitialThemeColors);

  // 自動同步儲存至 cookie
  useEffect(() => {
    Cookies.set("themeColors", JSON.stringify(themeColors), { expires: 365 });
    console.log("✅ Cookie updated:", themeColors);
  }, [themeColors]);

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
