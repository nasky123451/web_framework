import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import AssistantLayout from './Mode/AssistantLayout';
import StandardLayout from './Mode/StandardLayout';

import { useMode } from '../../context/ModeContext';

const ModeSetting: React.FC = () => {
  const { mode, setMode } = useMode();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        選擇顯示模式
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
        <Button
            variant={mode === 'standard' ? 'contained' : 'outlined'}
            onClick={() => setMode('standard')}
        >
          標準模式
        </Button>
        <Button
            variant={mode === 'assistant' ? 'contained' : 'outlined'}
            onClick={() => setMode('assistant')}
        >
          機器助手模式
        </Button>
      </Box>

      {/* 模式預覽 */}
      {mode === 'standard' ? (
        <StandardLayout />
      ) : (
        <AssistantLayout />
      )}
    </Box>
  );
};

export default ModeSetting;
