import React from "react";
import { Typography, Box, Divider, Stack, Paper } from "@mui/material";

import { useThemeContext, getColorCss } from '../../context/ThemeContext';

const About: React.FC = () => {
    const { themeColors } = useThemeContext();

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2, color: getColorCss(themeColors.text) }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
        關於設定
      </Typography>

      <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
        這裡展示系統的基本資訊與版本，並且未來會加入更多設定相關功能說明。
      </Typography>

      <Stack spacing={3} mt={4}>
        <Paper
          variant="outlined"
          sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}
        >
          <Typography variant="h6" gutterBottom fontWeight="medium">
            版本資訊
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            版本：1.0.0
            <br />
            發布日期：2025-07-21
          </Typography>
        </Paper>

        <Paper
          variant="outlined"
          sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}
        >
          <Typography variant="h6" gutterBottom fontWeight="medium">
            聯絡資訊
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            開發者：林君翰
            <br />
            Email：example@example.com
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

export default About;
