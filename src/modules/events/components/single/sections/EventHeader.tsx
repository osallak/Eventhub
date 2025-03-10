import { Box, Typography, Button, Stack, Chip } from '@mui/material';
import { Event } from '../../../types/event';
import EditIcon from '@mui/icons-material/Edit';
import useAuth from '@modules/auth/hooks/useAuth';

interface EventHeaderProps {
  event: Event;
  isOwner: boolean;
  hasJoined: boolean;
  onEdit?: () => void;
  onJoin?: () => void;
  onLeave?: () => void;
}

export const EventHeader = ({
  event,
  isOwner,
  hasJoined,
  onEdit,
  onJoin,
  onLeave,
}: EventHeaderProps) => {
  const isButtonDisabled =
    event.maxParticipants && event.participants?.length >= event.maxParticipants;
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (hasJoined) {
      onLeave?.();
    } else {
      onJoin?.();
    }
  };

  return (
    <Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {event.category && <Chip label={event.category} color="primary" size="small" />}
            <Chip
              label={event.eventType}
              variant="outlined"
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          </Stack>
        </Box>
        <Box>
          {isOwner ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{ minWidth: 120 }}
            >
              Edit Event
            </Button>
          ) : (
            <Button
              variant="contained"
              color={hasJoined ? 'error' : 'primary'}
              onClick={handleClick}
              disabled={!hasJoined && isButtonDisabled}
              sx={{ minWidth: 120 }}
            >
              {hasJoined ? 'Leave Event' : 'Join Event'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
