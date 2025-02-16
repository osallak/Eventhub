import { Theme } from '@mui/material';

export const getInputStyles = (theme: Theme) => ({
  '& .MuiInputLabel-root': {
    color: 'text.secondary',
  },
  '& .MuiOutlinedInput-root': {
    height: '56px',
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
  '& .MuiSelect-select': {
    height: '56px !important',
    lineHeight: '56px',
    padding: '0 14px',
  },
  // For date/time pickers
  '& .MuiPickersDay-root.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
});
