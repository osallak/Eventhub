import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Avatar,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string | null;
  };
  _onSave: (data: any) => void;
}

export const EditProfileDialog = ({ open, onClose, user, _onSave }: EditProfileDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{t('Edit Profile')}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Avatar Upload */}
          <Stack alignItems="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                position: 'relative',
              }}
              src={user.avatarUrl || undefined}
            >
              {user.firstName[0]}
              {user.lastName[0]}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <PhotoCameraIcon />
            </IconButton>
          </Stack>

          <TextField label={t('First Name')} defaultValue={user.firstName} fullWidth />
          <TextField label={t('Last Name')} defaultValue={user.lastName} fullWidth />
          <TextField label={t('Username')} defaultValue={user.username} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('Cancel')}</Button>
        <Button variant="contained" onClick={onClose}>
          {t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
