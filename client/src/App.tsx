import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from '@mui/material';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/LoadingSpinner';

const Login = React.lazy(() => import("./Login/Login"));
const MainPage = React.lazy(() => import("./Main/MainPage"));
const Dashboard = React.lazy(() => import("./Main/Page/Dashboard"));
const SettingPage = React.lazy(() => import("./Setting/Setting"));
const ThemeSetting = React.lazy(() => import("./Setting/components/ThemeSetting"));
const ModeSetting = React.lazy(() => import("./Setting/components/ModeSetting"));
const About = React.lazy(() => import("./Setting/components/About"));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/settings/*" 
            element={
              // <ProtectedRoute>
              //   <SettingPage />
              // </ProtectedRoute>
              <SettingPage />
            }
          >
            <Route path="theme" element={<ThemeSetting />} />
            <Route path="mode" element={<ModeSetting />} />
            <Route path="about" element={<About />} />
          </Route>
          <Route 
            path="/" 
            element={
              // <ProtectedRoute>
              //   <MainPage />
              // </ProtectedRoute>
              <MainPage />
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;