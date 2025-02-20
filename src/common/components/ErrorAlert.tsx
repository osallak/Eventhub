import { Alert } from '@mui/material';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert = ({ message }: ErrorAlertProps) => (
  <Alert severity="error" sx={{ mt: 2 }}>
    {message}
  </Alert>
);
