import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import TimezoneSelect, { allTimezones } from 'react-timezone-select';
import { EventFormData } from '../../types/form';
import { useState, useEffect } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

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
  const { t } = useTranslation();
  const theme = useTheme();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
        newErrors.startDate = t('Date cannot be in the past');
        isValid = false;
      }
    }

    // Validate end time only if both start and end times are set
    if (touched.endTime && formData.startTime && formData.endTime) {
      const startTime = dayjs(formData.startTime);
      const endTime = dayjs(formData.endTime);

      if (endTime.isBefore(startTime)) {
        newErrors.endTime = t('End time must be after start time');
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
            endTime: t('End time must be after start time'),
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

  const pickerStyles = {
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'divider',
      },
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiIconButton-root': {
      color: 'text.secondary',
    },
    '& .MuiPickersDay-root': {
      color: 'text.primary',
      '&.Mui-selected': {
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      },
    },
    '& .MuiClock-pin': {
      backgroundColor: 'primary.main',
    },
    '& .MuiClockPointer-root': {
      backgroundColor: 'primary.main',
    },
    '& .MuiClockPointer-thumb': {
      backgroundColor: 'primary.main',
      borderColor: 'primary.main',
    },
  };

  const timezoneSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
      boxShadow: 'none',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
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
    }),
    singleValue: (base: any) => ({
      ...base,
      color: theme.palette.text.primary,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: theme.palette.text.secondary,
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
            label={t('Event Date')}
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
                sx: pickerStyles,
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TimezoneSelect
              value={formData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
              onChange={(timezone) => onFormChange('timezone', timezone.value)}
              timezones={{
                ...allTimezones,
                'America/New_York': 'Eastern Time',
                'America/Chicago': 'Central Time',
                'America/Denver': 'Mountain Time',
                'America/Los_Angeles': 'Pacific Time',
              }}
              labelStyle="altName"
              styles={timezoneSelectStyles}
              placeholder={t('Select Time Zone')}
            />
            <FormHelperText>{t('Select event time zone')}</FormHelperText>
          </FormControl>
        </Grid>

        {/* Time Slots */}
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label={t('Start Time')}
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
                  sx: pickerStyles,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label={t('End Time')}
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
                  sx: pickerStyles,
                },
              }}
            />
          </Grid>

          {/* Duration Display - Always visible and centered */}
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}>
              <TextField
                fullWidth
                label={t('Duration')}
                value={calculateDuration()}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    color: theme.palette.text.secondary,
                    fontFamily: 'monospace',
                  },
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: theme.palette.text.secondary,
                  },
                  '& .MuiInputBase-input.Mui-readOnly': {
                    cursor: 'default',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderStyle: 'dashed',
                    borderColor: theme.palette.divider,
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
