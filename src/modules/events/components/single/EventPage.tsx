import { useAuth } from '@modules/auth/hooks/useAuth';
import { Box, Chip, Container, Grid, Paper, Typography } from '@mui/material';
import { Event } from '../../types/event';
import { EventDateTime } from './sections/EventDateTime';
import { EventDetails } from './sections/EventDetails';
import { EventHeader } from './sections/EventHeader';
import { EventLocation } from './sections/EventLocation';
import { EventParticipants } from './sections/EventParticipants';

interface EventPageProps {
  event: Event;
  isOwner: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
  onEdit?: () => void;
}

export const EventPage = ({ event, isOwner, onJoin, onLeave, onEdit }: EventPageProps) => {
  const { user } = useAuth();

  const handleJoin = () => {
    if (onJoin) {
      onJoin();
    }
  };

  const hasJoined = (event?.participants || []).some(
    (participant) => Number(participant.id) === Number(user?.id)
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        py: { xs: 2, md: 3 },
        px: { xs: 2, md: 0 },
        mt: { xs: 7, md: 8.5 },
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
            onJoin={handleJoin}
            onLeave={onLeave}
          />
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                About this event
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {event.description}
              </Typography>
            </Paper>

            <EventLocation event={event} />

            {event.rules && event.rules.length > 0 && (
              <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Rules and Guidelines
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
                  Additional Notes
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {event.notes}
                </Typography>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 88 }}>
              <EventDateTime event={event} />
              <EventDetails event={event} />
              <EventParticipants
                participants={event.participants || []}
                maxParticipants={event.maxParticipants}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
