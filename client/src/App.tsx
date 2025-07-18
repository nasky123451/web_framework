import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyles } from '@mui/styled-engine';
import Login from "./Login/Login.tsx";
import MainPage from "./Main/MainPage.tsx";
import Dashboard from "./Main/Page/Dashboard.tsx";
import SettingPage from "./Setting/Setting.tsx";
import ThemeSetting from "./Setting/components/ThemeSetting.tsx";
import ModeSetting from "./Setting/components/ModeSetting.tsx";

import { useThemeContext, getBackgroundCss } from "./context/ThemeContext";

const App: React.FC = () => {
  const { themeColors } = useThemeContext();

  return (
    <>
    <GlobalStyles styles={{ body: { background: getBackgroundCss(themeColors.background) } }} />
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/settings/*" element={<SettingPage />}>
          <Route path="theme" element={<ThemeSetting />} />
          <Route path="mode" element={<ModeSetting />} />
        </Route>
        <Route path="/" element={<MainPage />} >
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
