import { Box, Container, Grid, Paper, Typography, Button, Divider, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Event } from '../../types/event';
import { LocationMap } from '../create/LocationMap';
import { getInputStyles } from '../create/styles/inputStyles';
import { EventDateTime } from './sections/EventDateTime';
import { EventLocation } from './sections/EventLocation';
import { EventDetails } from './sections/EventDetails';
import { EventParticipants } from './sections/EventParticipants';
import { EventHeader } from './sections/EventHeader';

interface EventPageProps {
  event: Event;
  isOwner: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  onEdit?: () => void;
}

export const EventPage = ({ event, isOwner, onJoin, onLeave, onEdit }: EventPageProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const hasJoined = event.participants?.some(
    (participant) => participant.id === /* current user id */ 1
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        py: { xs: 2, md: 3 },
        px: { xs: 2, md: 0 },
        mt: { xs: 7, md: 8.5 }, // Add top margin to account for the topbar
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
          <EventHeader
            event={event}
            isOwner={isOwner}
            onEdit={onEdit}
            hasJoined={hasJoined}
            onJoin={onJoin}
            onLeave={onLeave}
          />
        </Paper>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {t('About this event')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {event.description}
              </Typography>
            </Paper>

            <EventLocation event={event} />

            {event.rules && event.rules.length > 0 && (
              <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {t('Rules and Guidelines')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {event.rules.map((rule, index) => (
                    <Chip key={index} label={rule} variant="outlined" />
                  ))}
                </Box>
              </Paper>
            )}

            {event.notes && (
              <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  {t('Additional Notes')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {event.notes}
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 88 }}>
              {' '}
              {/* Adjusted top position to account for topbar */}
              <EventDateTime event={event} />
              <EventDetails event={event} />
              <EventParticipants
                participants={event.participants || []}
                maxParticipants={event.max_participants}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
