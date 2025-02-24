import { Paper, Typography, Box, Button, Divider } from '@mui/material';
import { Event } from '../../../types/event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VideocamIcon from '@mui/icons-material/Videocam';
import { LocationMap } from '../../create/LocationMap';
import { LocationStep } from '../../create/LocationStep';

interface EventLocationProps {
  event: Event;
  isEditing?: boolean;
  onEdit?: (location: Partial<Event>) => void;
}

export const EventLocation = ({ event, isEditing, onEdit }: EventLocationProps) => {
  const isPhysical = event.eventType === 'physical' || event.eventType === 'hybrid';
  const isVirtual = event.eventType === 'virtual' || event.eventType === 'hybrid';

  if (isEditing && onEdit) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Location
        </Typography>
        <LocationStep
          formData={event}
          onFormChange={(field, value) => {
            onEdit({ [field]: value });
          }}
          onValidationChange={() => {}} // We'll handle validation at the form level
        />
      </Paper>
    );
  }

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
            <Box
              sx={{
                mt: 3,
                height: 300,
                width: '100%',
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                '& > div': {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
                '& .mapboxgl-map': {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
                '& .mapboxgl-canvas': {
                  width: '100% !important',
                  height: '100% !important',
                },
              }}
            >
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
