import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useThemeContext, getColorCss } from '../context/ThemeContext';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "載入中..." 
}) => {
  const { themeColors } = useThemeContext();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress size={50} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};