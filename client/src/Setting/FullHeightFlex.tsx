import React from "react";
import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

interface FullHeightFlexProps extends BoxProps {
  direction?: "row" | "column";
  gap?: number | string;
}

const FullHeightFlex: React.FC<FullHeightFlexProps> = ({
  direction = "row",
  gap,
  sx,
  children,
  ...rest
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        height: "100vh",
        width: "100vw",
        gap: gap,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default FullHeightFlex;
