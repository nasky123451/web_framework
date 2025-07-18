import React, { Component } from "react";
import { Box, Typography } from "@mui/material";
import { HexColorPicker } from "react-colorful";

interface Props {
  color: string;
  onChange: (color: string) => void;
}

export class TechHexColorPicker extends Component<Props> {
  render() {
    const { color, onChange } = this.props;

    return (
      <Box
        sx={{
          width: 280,
          p: 2,
          borderRadius: 3,
          backgroundColor: "#0a0a0a",
          border: "1px solid #00ffe1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          userSelect: "none",
          ".react-colorful": {
            borderRadius: 2,
            boxShadow: "0 0 10px #00ffe1",
            transition: "box-shadow 0.3s ease",
          },
          ".react-colorful:hover": {
            boxShadow: "0 0 15px #00fff7",
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#00fff7", mb: 1, fontFamily: "monospace" }}
        >
          Current Color: {color.toUpperCase()}
        </Typography>

        <HexColorPicker
          color={color}
          onChange={onChange}
          style={{ width: "100%", borderRadius: 8 }}
        />
      </Box>
    );
  }
}
