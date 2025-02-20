import { Routes } from '@common/constants/routes';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { EVENT_CATEGORIES } from '@modules/events/types/categories';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Button, Card, CardActions, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { formatPrice } from '../../utils/formatters';
import { EventActions } from './EventActions';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    category: (typeof EVENT_CATEGORIES)[keyof typeof EVENT_CATEGORIES];
    eventType: 'physical' | 'virtual' | 'hybrid';
    isPaid: boolean;
    price?: number;
    currency?: string;
    startDate: string;
    startTime: string;
    city?: string;
    maxParticipants?: number;
    currentParticipants?: number;
    imageUrl?: string;
    isFull: boolean;
    isOwner?: boolean;
    isParticipant?: boolean;
  };
}

export const EventCard = ({ event }: EventCardProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isPastEvent = dayjs(event.startDate).isBefore(dayjs(), 'day');

  // Calculate if event is full
  const hasLimitedSpots = event.maxParticipants !== undefined;
  const spotsLeft = hasLimitedSpots
    ? event.maxParticipants! - (event.currentParticipants || 0)
    : undefined;

  // Helper to get event type icon and text
  const getEventTypeInfo = (type: 'physical' | 'virtual' | 'hybrid') => {
    switch (type) {
      case 'physical':
        return { icon: '🏠', text: 'Physical' };
      case 'virtual':
        return { icon: '💻', text: 'Virtual' };
      default:
        return { icon: '🌐', text: 'Hybrid' };
    }
  };

  const typeInfo = getEventTypeInfo(event.eventType);

  const getJoinButtonState = () => {
    if (!isAuthenticated) {
      return {
        disabled: false,
        text: 'Login to Join',
      };
    }
    if (isPastEvent) {
      return {
        disabled: true,
        text: 'Event Ended',
      };
    }
    if (event.isFull) {
      return {
        disabled: true,
        text: 'Event Full',
      };
    }
    if (event.isParticipant) {
      return {
        disabled: true,
        text: 'Already Joined',
      };
    }
    if (event.isOwner) {
      return {
        disabled: true,
        text: 'You are the Owner',
      };
    }
    return {
      disabled: false,
      text: 'Join Event',
    };
  };

  const buttonState = getJoinButtonState();

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      const currentPath = router.asPath;
      console.log('EventCard current path:', currentPath);

      const loginUrl = `${Routes.Auth.Login}?returnUrl=${encodeURIComponent(currentPath)}`;
      console.log('EventCard login URL:', loginUrl);

      router.push(loginUrl);
      return;
    }
    // Handle join logic for authenticated users
    console.log('Joining event:', event.id);
  };

  const handleEditEvent = () => {
    router.push(`/events/edit/${event.id}`);
  };

  const handleDeleteEvent = () => {
    // TODO: Add confirmation dialog
    console.log('Delete event:', event.id);
  };

  const handleLeaveEvent = () => {
    // TODO: Add confirmation dialog
    console.log('Leave event:', event.id);
  };

  // Get spots text
  const getSpotsText = () => {
    if (hasLimitedSpots) {
      return `${spotsLeft} spots left`;
    }
    return 'Unlimited spots';
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
        p: 2.5,
        borderRadius: 3,
      }}
    >
      {/* Event Type & Price */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, width: '100%', justifyContent: 'center' }}>
        <Chip
          label={
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography sx={{ fontSize: '1rem' }}>{typeInfo.icon}</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{typeInfo.text}</Typography>
            </Stack>
          }
          size="small"
          sx={{
            height: 28,
            borderRadius: '14px',
            bgcolor: 'background.neutral',
            color: 'text.primary',
          }}
        />
        {event.isPaid ? (
          <Chip
            label={formatPrice(event.price || 0, event.currency)}
            size="small"
            sx={{
              height: 28,
              borderRadius: '14px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        ) : (
          <Chip
            label="Free"
            size="small"
            sx={{
              height: 28,
              borderRadius: '14px',
              bgcolor: 'success.light',
              color: 'success.contrastText',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        )}
      </Stack>

      {/* Title */}
      <Typography
        variant="h6"
        align="center"
        sx={{
          mb: 1.5,
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'text.primary',
          lineHeight: 1.3,
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          minHeight: '2.6em',
        }}
        title={event.title}
      >
        {event.title}
      </Typography>

      {/* Category */}
      <Chip
        label={event.category}
        size="small"
        sx={{
          mb: 2,
          height: 24,
          borderRadius: '12px',
          bgcolor: 'background.neutral',
          color: 'text.secondary',
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      />

      {/* Event Details */}
      <Stack spacing={1.5} sx={{ width: '100%', mb: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              lineHeight: 1.5,
            }}
          >
            {new Date(event.startDate).toLocaleDateString()} • {event.startTime}
          </Typography>
        </Stack>

        {event.city && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            >
              {event.city}
            </Typography>
          </Stack>
        )}

        {/* Spots information */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              lineHeight: 1.5,
            }}
          >
            {getSpotsText()}
          </Typography>
        </Stack>
      </Stack>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={buttonState.disabled}
          onClick={!isAuthenticated ? handleJoinClick : () => router.push(`/events/${event.id}`)}
          sx={{
            mt: 'auto',
            borderRadius: '20px',
            textTransform: 'none',
            py: 1,
            minWidth: '180px',
            width: '100%',
            mx: 'auto',
          }}
        >
          {buttonState.text}
        </Button>
        {/* ... other actions ... */}
      </CardActions>

      {/* Show actions menu only if authenticated and is owner/participant */}
      {isAuthenticated && (event.isOwner || event.isParticipant) && (
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <EventActions
            eventId={event.id}
            isOwner={event.isOwner || false}
            isParticipant={event.isParticipant || false}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onLeave={handleLeaveEvent}
          />
        </Box>
      )}
    </Card>
  );
};
