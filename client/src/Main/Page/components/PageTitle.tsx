import React from 'react';
import { Typography } from '@mui/material';
import { useThemeContext, getColorCss } from '../../../context/ThemeContext';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  const { themeColors } = useThemeContext();

  return (
    <Typography
      sx={{
        paddingTop: '16px',
        paddingLeft: '16px',
        color: getColorCss(themeColors.title),
      }}
      variant="h4"
      gutterBottom
    >
      {title}
    </Typography>
  );
};

export default PageTitle;