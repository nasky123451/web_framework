import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login/Login.tsx";
import DashboardPage from "./Main/Dashboard.tsx";
import SettingPage from "./Setting/Setting.tsx";
import ThemeSetting from "./Setting/components/ThemeSetting.tsx";
// import ProfileSetting from "./Setting/ProfileSetting.tsx";
// import SecuritySetting from "./Setting/SecuritySetting.tsx";
// import NotificationSetting from "./Setting/NotificationSetting.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/settings/*" element={<SettingPage />}>
          <Route path="theme" element={<ThemeSetting />} />
        </Route>

        <Route path="/" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
