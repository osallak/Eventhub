import { Box, FormControl, Grid, TextField, useTheme } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import TimezoneSelect, { allTimezones } from 'react-timezone-select';
import { EventFormData } from '../../types/form';
import { getInputStyles } from './styles/inputStyles';

interface DateTimeStepProps {
  formData: EventFormData;
  onFormChange: (field: keyof EventFormData, value: any) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface ValidationErrors {
  startDate?: string;
  startTime?: string;
  endTime?: string;
  customDuration?: string;
}

export const DateTimeStep = ({ formData, onFormChange, onValidationChange }: DateTimeStepProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const theme = useTheme();
  const inputStyles = getInputStyles(theme);

  // Convert Date to Dayjs for the pickers
  const convertToDateValue = (date: Date | null | undefined) => {
    return date ? dayjs(date) : null;
  };

  // Validation function for date and time
  const validateDateTime = () => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Get current date (start of day for proper comparison)
    const today = dayjs().startOf('day');

    // Only validate if fields have been touched
    if (touched.startDate && formData.startDate) {
      const selectedDate = dayjs(formData.startDate).startOf('day');
      if (selectedDate.isBefore(today)) {
        newErrors.startDate = 'Date cannot be in the past';
        isValid = false;
      }
    }

    // Validate end time only if both start and end times are set
    if (touched.endTime && formData.startTime && formData.endTime) {
      const startTime = dayjs(formData.startTime);
      const endTime = dayjs(formData.endTime);

      if (endTime.isBefore(startTime)) {
        newErrors.endTime = 'End time must be after start time';
        isValid = false;
      }
    }

    setErrors(newErrors);
    onValidationChange(isValid);
    return isValid;
  };

  // Handle field blur with specific end time validation
  const handleBlur = (field: keyof ValidationErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'endTime') {
      // Special validation for end time
      if (formData.startTime && formData.endTime) {
        const startTime = dayjs(formData.startTime);
        const endTime = dayjs(formData.endTime);

        if (endTime.isBefore(startTime)) {
          setErrors((prev) => ({
            ...prev,
            endTime: 'End time must be after start time',
          }));
          onValidationChange(false);
          return;
        }
      }
    }

    // Clear end time error if valid
    setErrors((prev) => ({
      ...prev,
      endTime: undefined,
    }));
    onValidationChange(true);

    validateDateTime();
  };

  // Custom date/time change handlers
  const handleDateChange = (date: Dayjs | null) => {
    onFormChange('startDate', date?.toDate() || null);
    // Only validate if the field was previously touched and has a complete value
    if (touched.startDate && date?.isValid()) {
      validateDateTime();
    }
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', time: Dayjs | null) => {
    onFormChange(field, time?.toDate() || null);
    // Only validate if the field was previously touched and has a complete value
    if (touched[field] && time?.isValid()) {
      validateDateTime();
    }
  };

  // Calculate duration between start and end time
  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = dayjs(formData.startTime);
      const end = dayjs(formData.endTime);

      if (end.isBefore(start)) {
        return '--:--';
      }

      const diffMinutes = end.diff(start, 'minute');
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;

      // Format as HH:mm
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return '--:--';
  };

  const timezoneSelectStyles = {
    control: (base: any) => ({
      ...base,
      height: '56px',
      minHeight: '56px',
      backgroundColor: 'transparent',
      borderColor: theme.palette.divider,
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
      boxShadow: 'none',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
      zIndex: theme.zIndex.modal,
    }),
    option: (base: any, state: { isFocused: boolean; isSelected: boolean }) => ({
      ...base,
      backgroundColor: getOptionBackground(state),
      color: state.isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
      '&:hover': {
        backgroundColor: state.isSelected ? theme.palette.primary.dark : theme.palette.action.hover,
      },
    }),
    input: (base: any) => ({
      ...base,
      color: theme.palette.text.primary,
      height: '24px',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: theme.palette.text.primary,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: theme.palette.text.secondary,
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '8px 14px',
    }),
  };

  const getOptionBackground = (state: { isSelected: boolean; isFocused: boolean }) => {
    if (state.isSelected) {
      return theme.palette.primary.main;
    }
    if (state.isFocused) {
      return theme.palette.action.hover;
    }
    return 'transparent';
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Event Date and Timezone */}
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Event Date"
            value={convertToDateValue(formData.startDate)}
            onChange={handleDateChange}
            onClose={() => handleBlur('startDate')}
            minDate={dayjs().startOf('day')}
            disablePast
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.startDate,
                helperText: errors.startDate,
                required: true,
                onBlur: () => {
                  if (formData.startDate) {
                    handleBlur('startDate');
                  }
                },
                sx: inputStyles,
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TimezoneSelect
              value={formData.timezone || ''}
              onChange={(timezone) => onFormChange('timezone', timezone.value)}
              timezones={allTimezones}
              labelStyle="altName"
              styles={timezoneSelectStyles}
              placeholder="Select event time zone"
            />
          </FormControl>
        </Grid>

        {/* Time Slots */}
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="Start Time"
              value={convertToDateValue(formData.startTime)}
              onChange={(time) => handleTimeChange('startTime', time)}
              onClose={() => {
                if (formData.startTime) {
                  handleBlur('startTime');
                }
              }}
              ampm
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startTime,
                  helperText: errors.startTime,
                  required: true,
                  onBlur: () => {
                    if (formData.startTime) {
                      handleBlur('startTime');
                    }
                  },
                  sx: inputStyles,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="End Time"
              value={convertToDateValue(formData.endTime)}
              onChange={(time) => handleTimeChange('endTime', time)}
              onClose={() => {
                if (formData.endTime) {
                  handleBlur('endTime');
                }
              }}
              ampm
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.endTime,
                  helperText: errors.endTime,
                  required: true,
                  onBlur: () => {
                    if (formData.endTime) {
                      handleBlur('endTime');
                    }
                  },
                  sx: inputStyles,
                },
              }}
            />
          </Grid>

          {/* Duration Display */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}>
              <TextField
                fullWidth
                label="Duration"
                value={calculateDuration()}
                InputProps={{ readOnly: true }}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    color: theme.palette.text.secondary,
                    fontFamily: 'monospace',
                  },
                  '& .MuiInputBase-input.Mui-readOnly': {
                    cursor: 'default',
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
