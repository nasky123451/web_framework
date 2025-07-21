import React from 'react';
import { Box, TextField, Tooltip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';

export interface DynamicField {
  key: string;
  label: string;
  value: string;
  type?: string;
  // 若需要其他屬性可補充
}

export interface CustomField {
  id: number;
  label: string;
  value: string;
}

interface SortableLabelProps {
  id: string | number;
  label: string;
  disabled: boolean;
  onLabelChange: (id: string | number, newLabel: string) => void;
  dragHandleProps: any;
}

const SortableLabel: React.FC<SortableLabelProps> = ({
  id,
  label,
  disabled,
  onLabelChange,
  dragHandleProps,
}) => {
  return (
    <TextField
      size="small"
      label="欄位名稱"
      value={label}
      onChange={(e) => onLabelChange(id, e.target.value)}
      fullWidth
      disabled={disabled}
      {...dragHandleProps}
      sx={{
        cursor: disabled ? 'default' : 'grab',
        userSelect: disabled ? 'auto' : 'none',
        mb: 0.5,
      }}
    />
  );
};

interface SortableDynamicFieldProps {
  field: DynamicField;
  index: number;
  saving: boolean;
  handleFieldChange: (key: string, value: string) => void;
  handleLabelChange: (key: string, label: string) => void;
  daysUntilBirthday: (birthday: string) => number | null;
}

export const SortableDynamicField: React.FC<SortableDynamicFieldProps> = ({
  field,
  saving,
  handleFieldChange,
  handleLabelChange,
  daysUntilBirthday,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.key });

  const days = field.key === 'birthday' ? daysUntilBirthday(field.value) : null;

  return (
    <Box
      ref={setNodeRef}
      key={field.key}
      gridColumn={field.key === 'address' ? 'span 2' : undefined}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        borderRadius: 1,
        border: '1px solid transparent',
        '&:hover': { borderColor: 'rgba(0,0,0,0.12)' },
        backgroundColor: 'white',
        p: 1,
        mb: 1,
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      <SortableLabel
        id={field.key}
        label={field.label}
        disabled={saving}
        onLabelChange={handleLabelChange}
        dragHandleProps={{ ...listeners, ...attributes }}
      />

      {/* InfoItem 需你主組件傳入或另外引入，這裡用簡易示意 */}
      <Box sx={{ mt: 0.5 }}>
        {/* 這裡用一個簡單的輸入框代替 InfoItem，主組件使用時改成你的 InfoItem */}
        <TextField
          fullWidth
          size="small"
          label={field.label}
          value={field.value}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          disabled={saving}
        />
        {field.key === 'birthday' && days != null && (
          <Tooltip title={`距離生日還有 ${days} 天`} arrow>
            <InfoIcon
              color={days <= 7 ? 'warning' : 'info'}
              sx={{ cursor: 'default', mt: 0.5 }}
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

interface SortableCustomFieldProps {
  field: CustomField;
  saving: boolean;
  handleCustomFieldChange: (id: number, value: string) => void;
  handleCustomFieldLabelChange: (id: number, label: string) => void;
  removeCustomField: (id: number) => void;
  totalCustomCount: number;
}

export const SortableCustomField: React.FC<SortableCustomFieldProps> = ({
  field,
  saving,
  handleCustomFieldChange,
  handleCustomFieldLabelChange,
  removeCustomField,
  totalCustomCount,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  return (
    <Box
      ref={setNodeRef}
      key={field.id}
      gridColumn={totalCustomCount === 1 ? 'span 2' : undefined}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        pb: 1,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      <SortableLabel
        id={field.id}
        label={field.label}
        disabled={saving}
        onLabelChange={handleCustomFieldLabelChange}
        dragHandleProps={{ ...listeners, ...attributes }}
      />

      <Box display="flex" gap={1} mt={0.5} alignItems="center">
        <TextField
          size="small"
          value={field.value}
          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
          fullWidth
          disabled={saving}
        />
        <Tooltip title="刪除欄位">
          <IconButton
            onClick={() => removeCustomField(field.id)}
            size="small"
            color="error"
            disabled={saving}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

// handleDragEnd helper
interface HandleDragEndProps {
  event: any;
  dynamicFields: DynamicField[];
  customFields: CustomField[];
  setDynamicFields: React.Dispatch<React.SetStateAction<DynamicField[]>>;
  setCustomFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
}

export function handleDragEnd({
  event,
  dynamicFields,
  customFields,
  setDynamicFields,
  setCustomFields,
}: HandleDragEndProps) {
  const { active, over } = event;
  if (!over) return;
  if (active.id === over.id) return;

  const dynamicKeys = dynamicFields.map((f) => f.key);
  const customIds = customFields.map((f) => f.id);

  if (dynamicKeys.includes(active.id) && dynamicKeys.includes(over.id)) {
    const oldIndex = dynamicFields.findIndex((f) => f.key === active.id);
    const newIndex = dynamicFields.findIndex((f) => f.key === over.id);
    setDynamicFields((items) => arrayMove(items, oldIndex, newIndex));
  } else if (customIds.includes(active.id) && customIds.includes(over.id)) {
    const oldIndex = customFields.findIndex((f) => f.id === active.id);
    const newIndex = customFields.findIndex((f) => f.id === over.id);
    setCustomFields((items) => arrayMove(items, oldIndex, newIndex));
  }
}
