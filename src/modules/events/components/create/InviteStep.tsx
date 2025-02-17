import { Box, Button, Chip, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventFormData } from '../../types/form';
import { getInputStyles } from './styles/inputStyles';

interface InviteStepProps {
  formData: EventFormData;
  onFormChange: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
}

const buttonStyles = {
  height: '32px',
  minWidth: '80px',
  mr: -0.5,
  borderRadius: '16px',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
};

const inputStyles = (theme: Theme) => ({
  ...getInputStyles(theme),
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    pr: 0.5,
    '& fieldset': {
      borderColor: 'divider',
    },
  },
});

export const InviteStep = ({ formData, onFormChange }: InviteStepProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAddEmail = () => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const updatedEmails = [...(formData.invitedEmails || []), email];
      onFormChange('invitedEmails', updatedEmails);
      setEmail('');
    }
  };

  const handleRemoveEmail = (indexToRemove: number) => {
    const updatedEmails = (formData.invitedEmails || []).filter(
      (_, index) => index !== indexToRemove
    );
    onFormChange('invitedEmails', updatedEmails);
  };

  const handleCopyLink = () => {
    const eventId = formData.id || 'preview';
    navigator.clipboard.writeText(`${window.location.origin}/events/invite/${eventId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Share Link Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('Share via Link')}
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={`${window.location.origin}/events/invite/${formData.id || 'preview'}`}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Button variant="contained" onClick={handleCopyLink} sx={buttonStyles}>
                  {copied ? t('Copied!') : t('Copy')}
                </Button>
              ),
            }}
            sx={inputStyles(theme)}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Email Invites Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('Invite via Email')}
          </Typography>
          <TextField
            fullWidth
            size="small"
            label={t('Email Address')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  onClick={handleAddEmail}
                  disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                  sx={buttonStyles}
                >
                  {t('Add')}
                </Button>
              ),
            }}
            sx={inputStyles(theme)}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 2 }}>
            {(formData.invitedEmails || []).map((email, index) => (
              <Chip
                key={index}
                label={email}
                onDelete={() => handleRemoveEmail(index)}
                size="small"
                sx={{ bgcolor: 'background.paper' }}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
