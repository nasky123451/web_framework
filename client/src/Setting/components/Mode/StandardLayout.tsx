import React from 'react';
import { Typography, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './index.module.css';

const StandardLayout: React.FC = () => {
  return (
    <Paper elevation={6} className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.title}>
        標準模式預覽
      </Typography>

      <div className={styles.flexRow}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <DashboardIcon className={styles.sidebarIcon} />
          <Typography variant="h6" className={styles.sidebarTitle}>
            Sidebar
          </Typography>
          <Typography className={styles.sidebarText}>
            功能選單區
          </Typography>
        </div>

        {/* 中間內容區 */}
        <div className={styles.contentArea}>
          {/* Topbar */}
          <div className={styles.topbar}>
            <MenuIcon className={styles.topbarIcon} />
            <Typography variant="h5" className={styles.topbarTitle}>
              Topbar
            </Typography>
          </div>

          {/* MainBox */}
          <div className={styles.mainBox}>
            Main Box
            <br />
            <Typography component="span" className={styles.mainBoxSubtext}>
              這是主要內容區塊，可以放置各種功能與資訊。
            </Typography>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default StandardLayout;
