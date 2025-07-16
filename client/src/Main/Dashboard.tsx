import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import { DraggableCardGrid } from './components/Draggable';
import { useThemeContext, getBackgroundCss } from '../context/ThemeContext';

const DashboardPage: React.FC = () => {
  const { themeColors } = useThemeContext();
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      return ['Alice', 'Bob', 'Carol'];
    }
    fetchData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />

        <Box
          component="main"
          sx={{
            p: 3,
            flexGrow: 1,
            background: getBackgroundCss(themeColors.background),
          }}
        >
          <Typography variant="h4" gutterBottom>
            Dashboard Overview
          </Typography>

          <DraggableCardGrid data={data} /> 
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
