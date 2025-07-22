// components/ErrorBoundary.tsx
import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useThemeContext, getColorCss } from '../context/ThemeContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error} 
          resetError={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  const { themeColors } = useThemeContext();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 3,
        background: getColorCss(themeColors.background),
      }}
    >
      <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          應用程式發生錯誤
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error?.message || '發生了未預期的錯誤'}
        </Typography>
      </Alert>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={resetError}>
          重新載入
        </Button>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          刷新頁面
        </Button>
      </Box>
    </Box>
  );
};