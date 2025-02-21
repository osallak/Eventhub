import { Paper, Typography, Box, Avatar, AvatarGroup } from '@mui/material';
import { User } from '../../../../auth/types/auth.types';

interface EventParticipantsProps {
  participants: User[];
  maxParticipants: number | null | undefined;
}

export const EventParticipants = ({ participants, maxParticipants }: EventParticipantsProps) => {
  const getParticipantsText = () => {
    const participantCount = `${participants.length} participant${
      participants.length !== 1 ? 's' : ''
    }`;
    const maxText = maxParticipants ? `Maximum ${maxParticipants}` : 'Unlimited spots';

    return `${participantCount} • ${maxText}`;
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Participants
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {getParticipantsText()}
        </Typography>
      </Box>

      <AvatarGroup max={6} sx={{ justifyContent: 'flex-start' }}>
        {participants.map((participant) => (
          <Avatar
            key={participant.id}
            alt={participant.name}
            src={participant.avatar}
            sx={{ width: 40, height: 40 }}
          />
        ))}
      </AvatarGroup>
    </Paper>
  );
};
