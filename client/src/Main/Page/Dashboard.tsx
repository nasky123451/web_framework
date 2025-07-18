import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
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
    fetchData().then((d) => setData(d));
  }, []);

  return (
    <Box>
      <PageTitle title="Dashboard Overview" />

      <Box sx={{ flexGrow: 1, width: '100%', overflow: 'auto' }}>
        <DraggableCardGrid data={data} />
      </Box>
    </Box>
  );
};

export default Dashboard;
