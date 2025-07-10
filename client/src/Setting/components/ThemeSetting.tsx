import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Slider,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import { useThemeContext } from '../../context/ThemeContext';

type ThemeParts = 'sidebar' | 'topbar' | 'box';

const ThemeSetting: React.FC = () => {
  const { themeColors, setThemeColors } = useThemeContext();

  const [selectedPart, setSelectedPart] = useState<ThemeParts>('sidebar');
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [colorFrom, setColorFrom] = useState('#1976d2');
  const [colorTo, setColorTo] = useState('#42a5f5');
  const [angle, setAngle] = useState(90);

  useEffect(() => {
    const part = themeColors[selectedPart];
    if (part.gradient.enabled) {
      setGradientEnabled(true);
      setColorFrom(part.gradient.stops[0].color || '#1976d2');
      setColorTo(part.gradient.stops[part.gradient.stops.length - 1].color || '#42a5f5');
      setAngle(part.gradient.angle || 90);
    } else {
      setGradientEnabled(false);
      setColorFrom(part.color || '#1976d2');
      setColorTo('#42a5f5');
      setAngle(90);
    }
  }, [selectedPart, themeColors]);

  const updateGradient = (newFrom: string, newTo: string, newAngle: number) => {
    setThemeColors((prev) => ({
      ...prev,
      [selectedPart]: {
        ...prev[selectedPart],
        gradient: {
          enabled: true,
          from: newFrom,
          to: newTo,
          angle: newAngle,
        },
      },
    }));
  };

  const updateSingleColor = (newColor: string) => {
    setThemeColors((prev) => ({
      ...prev,
      [selectedPart]: {
        ...prev[selectedPart],
        color: newColor,
        gradient: {
          enabled: false,
          from: '',
          to: '',
          angle: 90,
        },
      },
    }));
  };

  const toggleGradient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setGradientEnabled(enabled);
    if (!enabled) {
      updateSingleColor(colorFrom);
    } else {
      updateGradient(colorFrom, colorTo, angle);
    }
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        主題顏色設定
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="select-part-label">調整項目</InputLabel>
        <Select
          labelId="select-part-label"
          value={selectedPart}
          label="調整項目"
          onChange={(e) => setSelectedPart(e.target.value as ThemeParts)}
        >
          <MenuItem value="sidebar">Sidebar</MenuItem>
          <MenuItem value="topbar">Topbar</MenuItem>
          <MenuItem value="box">Box</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={<Switch checked={gradientEnabled} onChange={toggleGradient} />}
        label="啟用漸層"
      />

      {gradientEnabled ? (
        <>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              漸層起始色
            </Typography>
            <ChromePicker
              color={colorFrom}
              onChangeComplete={(color) => {
                setColorFrom(color.hex);
                updateGradient(color.hex, colorTo, angle);
              }}
              disableAlpha
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              漸層結束色
            </Typography>
            <ChromePicker
              color={colorTo}
              onChangeComplete={(color) => {
                setColorTo(color.hex);
                updateGradient(colorFrom, color.hex, angle);
              }}
              disableAlpha
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              漸層角度 ({angle}°)
            </Typography>
            <Slider
              min={0}
              max={360}
              value={angle}
              onChange={(_e, val) => {
                if (typeof val === 'number') {
                  setAngle(val);
                  updateGradient(colorFrom, colorTo, val);
                }
              }}
              valueLabelDisplay="auto"
            />
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            單色顏色
          </Typography>
          <ChromePicker
            color={colorFrom}
            onChangeComplete={(color) => {
              setColorFrom(color.hex);
              updateSingleColor(color.hex);
            }}
            disableAlpha
          />
        </Box>
      )}
    </Box>
  );
};

export default ThemeSetting;
