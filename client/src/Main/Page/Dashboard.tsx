import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { DraggableCardGrid } from './components/Dashboard/Draggable';
import PageTitle from './components/PageTitle';
import { getBackgroundCss, useThemeContext } from '../../context/ThemeContext';

const Dashboard: React.FC = () => {
  const { themeColors } = useThemeContext();
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      return ['Alice', 'Bob', 'Carol'];
    }
    fetchData().then((d) => {
      setData(d);
    });
  }, []);

  return (
    <>
      <PageTitle title="Dashboard Overview" />

      <Box sx={{ width: '100%' }}>
        <DraggableCardGrid data={data} />
      </Box>
    </>
  );
};

export default Dashboard;