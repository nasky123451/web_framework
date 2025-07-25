import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import { useThemeContext, getColorCss } from '../context/ThemeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  disableAuthCheck?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
  disableAuthCheck = true,  // 建議預設為 false
}) => {
  const { user, isLoading } = useAuthContext();

  if (disableAuthCheck) {
    // 直接顯示內容，不跳轉
    return (
      <>{children}</>
    );
  }

  return user ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  );
};
