import React from 'react';
import { Typography, Paper } from '@mui/material';
import robotImage from '../../../image/robot.png';
import styles from './index.module.css'; // CSS Module

const AssistantLayout: React.FC = () => {
  return (
    <Paper elevation={8} className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.title}>
        機器助手模式預覽
      </Typography>

      <div className={styles.contentBox}>
        <img src={robotImage} alt="機器人" className={styles.robotImage} />
        <Typography variant="body1" className={styles.text}>
          機器助手模式中，畫面簡潔只顯示機器人與互動內容區域，讓使用者專注於智能輔助，提升效率與體驗。
        </Typography>
      </div>
    </Paper>
  );
};

export default AssistantLayout;
