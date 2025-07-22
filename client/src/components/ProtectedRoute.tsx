import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import { useThemeContext, getColorCss } from '../context/ThemeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/login" 
}) => {
  const { user, isLoading } = useAuthContext();
  const { themeColors } = useThemeContext();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: getColorCss(themeColors.background),
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? <>{children}</> : <Navigate to={redirectTo} replace />;
};