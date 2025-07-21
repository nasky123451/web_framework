import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

interface EditableTextProps {
  value: string;
  onChange: (val: string) => void;
  variant?: 'h5' | 'h6' | 'subtitle1' | 'body1';
  color?: string;
  bold?: boolean;
  disabled?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  variant = 'body1',
  color,
  bold = false,
  disabled = false, 
}) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  React.useEffect(() => {
    if (disabled && editing) {
      setEditing(false);
    }
  }, [disabled, editing]);

  const handleSave = () => {
    onChange(tempValue);
    setEditing(false);
  };

  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: 1 }}>
      {editing ? (
        <>
          <TextField
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            size="small"
            variant="standard"
            sx={{ fontWeight: bold ? 'bold' : undefined }}
            disabled={disabled}  // TextField disabled
          />
          <Tooltip title="確認修改">
            <IconButton size="small" onClick={handleSave} disabled={disabled}>
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Typography
            variant={variant}
            color={color}
            fontWeight={bold ? 'bold' : undefined}
          >
            {value}
          </Typography>
          <Tooltip title={disabled ? '無法編輯' : '編輯'}>
            <span> {/* 用span包住，避免tooltip報錯 */}
              <IconButton
                size="small"
                onClick={() => !disabled && setEditing(true)}  // disabled狀態下不能點
                disabled={disabled}  // IconButton disabled
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </>
      )}
    </Box>
  );
};

export default EditableText;
