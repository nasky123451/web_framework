import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/GridLegacy';
import {
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Box,
} from '@mui/material';
import { blue, green, purple } from '@mui/material/colors';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';

const DashboardPage: React.FC = () => {
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

  const colors = [blue[500], green[500], purple[500]];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* 側邊欄 */}
      <Sidebar />

      {/* 主體區域，包含 Topbar 與內容 */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 頂欄 */}
        <Topbar />

        {/* 內容主體，放卡片 */}
        <Box component="main" sx={{ p: 3, flexGrow: 1, bgcolor: '#f5f5f5' }}>
          <Typography variant="h4" gutterBottom>
            Dashboard Overview
          </Typography>

          <Grid container spacing={3}>
            {data.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: colors[index % colors.length] }}>
                        {item[0]}
                      </Avatar>
                    }
                    title={item}
                    subheader={`資料分析項目 #${index + 1}`}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      這是 {item} 的詳細分析資訊，可以根據需要自訂內容呈現方式。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
