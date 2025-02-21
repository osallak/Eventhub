import { Paper, Typography, Box, Chip, Divider } from '@mui/material';
import { Event } from '../../../types/event';
import { useTranslation } from 'react-i18next';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';

interface EventDetailsProps {
  event: Event;
}

export const EventDetails = ({ event }: EventDetailsProps) => {
  const { t } = useTranslation();

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('Event Details')}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PeopleIcon sx={{ mr: 2, color: 'text.secondary' }} />
        <Typography>
          {t('Maximum Participants')}: {event.max_participants}
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
