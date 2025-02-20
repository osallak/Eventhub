import { Box, Container, Paper, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 8,
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)'
            : 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={theme.palette.mode === 'dark' ? 3 : 1}
          sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 2,
            background: theme.palette.background.paper,
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor:
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
};
