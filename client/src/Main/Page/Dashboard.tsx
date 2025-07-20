import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { DraggableCardGrid } from './components/Dashboard/Draggable';
import PageTitle from './components/PageTitle';
import { getColorCss, useThemeContext } from '../../context/ThemeContext';
import styles from './index.module.css'; // ✅ 引入 CSS Module

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
    <Box
      className={styles.dashboardContainer}
    >
      <PageTitle title="Dashboard Overview" />

      <Box className={styles.dashboardContent}>
        <DraggableCardGrid data={data} />
      </Box>
    </Box>
  );
};

export default Dashboard;
