import { Paper, Typography, Box, Chip, Divider } from '@mui/material';
import { Event } from '../../../types/event';
import { useTranslation } from 'react-i18next';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import { DetailsStep } from '../../create/DetailsStep';

interface EventDetailsProps {
  event: Event;
  isEditing?: boolean;
  onEdit?: (details: Partial<Event>) => void;
}

export const EventDetails = ({ event, isEditing, onEdit }: EventDetailsProps) => {
  const { t } = useTranslation();

  if (isEditing && onEdit) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Event Details
        </Typography>
        <DetailsStep
          formData={event}
          onFormChange={(field, value) => {
            onEdit({ [field]: value });
          }}
        />
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('Event Details')}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PeopleIcon sx={{ mr: 2, color: 'text.secondary' }} />
        <Typography>
          {t('Maximum Participants')}:{' '}
          {event.maxParticipants > 0 ? event.maxParticipants : t('Unlimited')}
        </Typography>
      </Box>

      {event.min_age > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
          <Typography>
            {t('Minimum Age')}: {event.min_age}+
          </Typography>
        </Box>
      )}

      {event.is_paid && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PaidIcon sx={{ mr: 2, color: 'text.secondary' }} />
          <Typography>
            {t('Price')}: {event.price} {event.currency}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
