import React from 'react';
import { Typography } from '@mui/material';
import { useThemeContext, getBackgroundCss } from '../../../context/ThemeContext';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  const { themeColors } = useThemeContext();

  return (
    <Typography
      sx={{
        paddingTop: '16px',
        color: getBackgroundCss(themeColors.title),
      }}
      variant="h4"
      gutterBottom
    >
      {title}
    </Typography>
  );
};

export default PageTitle;