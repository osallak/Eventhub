import { Box, Paper } from '@mui/material';
import { ReactNode } from 'react';

interface StepWrapperProps {
  children: ReactNode;
  actions: ReactNode;
}

export const StepWrapper = ({ children, actions }: StepWrapperProps) => {
  return (
    <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>
      <Paper
        sx={{
          position: 'relative',
          minHeight: '400px',
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Content Area */}
        <Box sx={{ p: 3, flex: 1 }}>
          {children}
        </Box>

        {/* Actions Area */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            mt: 'auto',
          }}
        >
          {actions}
        </Box>
      </Paper>
    </Box>
  );
};
