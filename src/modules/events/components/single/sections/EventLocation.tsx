import { Paper, Typography, Box, Button, Divider } from '@mui/material';
import { Event } from '../../../types/event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VideocamIcon from '@mui/icons-material/Videocam';
import { LocationMap } from '../../create/LocationMap';

interface EventLocationProps {
  event: Event;
}

export const EventLocation = ({ event }: EventLocationProps) => {
  const isPhysical = event.eventType === 'physical' || event.eventType === 'hybrid';
  const isVirtual = event.eventType === 'virtual' || event.eventType === 'hybrid';

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Location
      </Typography>

      {isPhysical && (
        <Box sx={{ mb: isVirtual ? 3 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle1">{event.venueName}</Typography>
              <Typography color="text.secondary">
                {event.hideAddress
                  ? event.city
                  : `${event.address}${event.postalCode ? `, ${event.postalCode}` : ''}`}
              </Typography>
            </Box>
          </Box>

          {!event.hideAddress && event.latitude && event.longitude && (
            <Box sx={{ mt: 3, height: 300, borderRadius: 1, overflow: 'hidden' }}>
              <LocationMap
                address={event.address}
                city={event.city}
                onLocationSelect={() => {}}
                initialCoordinates={[parseFloat(event.longitude), parseFloat(event.latitude)]}
              />
            </Box>
          )}
        </Box>
      )}

      {isVirtual && isPhysical && <Divider sx={{ my: 3 }} />}

      {isVirtual && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <VideocamIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Typography variant="subtitle1">Online Event</Typography>
          </Box>
          {event.meetingLink && (
            <Button
              variant="outlined"
              href={event.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ ml: 5 }}
            >
              Join Meeting
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};
