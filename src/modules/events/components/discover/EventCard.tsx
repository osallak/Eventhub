import { Routes } from '@common/constants/routes';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { Event } from '@modules/events/types/event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import { formatPrice } from '../../utils/formatters';

dayjs.extend(utc);

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isPastEvent = dayjs(event.startDate).isBefore(dayjs(), 'day');

  console.log('EventCard auth state:', { isAuthenticated }); // Debug log

  // Calculate if event is full
  const hasLimitedSpots = event.maxParticipants !== undefined;
  const spotsLeft = hasLimitedSpots
    ? event.maxParticipants! - event.currentParticipants
    : undefined;

  // Update the type helper to handle backend data correctly
  const getEventTypeInfo = (type: string) => {
    // Add debug log
    console.log('Event type from backend:', type);

    switch (type?.toLowerCase()) {
      case 'physical':
        return { icon: '🏠', text: 'Physical' };
      case 'virtual':
        return { icon: '💻', text: 'Virtual' };
      case 'hybrid':
        return { icon: '🌐', text: 'Hybrid' };
      default:
        // Default to physical if type is undefined or unknown
        console.warn(`Unknown event type: ${type}, defaulting to physical`);
        return { icon: '🏠', text: 'Physical' };
    }
  };

  const typeInfo = getEventTypeInfo(event.eventType);

  const getJoinButtonState = () => {
    console.log('getJoinButtonState called with isAuthenticated:', isAuthenticated); // Debug log
    if (!isAuthenticated) {
      return {
        disabled: false,
        text: 'Login to Join',
      };
    }

    // Only check these states for authenticated users
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
    // TODO: Add these properties to Event type when available
    const isParticipant = false; // event.is_participant;
    const isOwner = event.creator?.id === 1; // Replace with actual user ID check

    if (isParticipant) {
      return {
        disabled: true,
        text: 'Already Joined',
      };
    }
    if (isOwner) {
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

  const formatDateTime = (dateStr: string, timeStr: string | null) => {
    const dateTime = dayjs(dateStr);
    const time = timeStr?.substring(0, 5) || '00:00'; // Default time if not provided

    return {
      date: dateTime.format('MMM D, YYYY'),
      time,
    };
  };

  const datetime = formatDateTime(event.startDate, event.endTime);

  const getLocationInfo = () => {
    return (
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        {/* Physical Location */}
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
            {event.venueName && event.city
              ? `${event.venueName}, ${event.city}`
              : event.venueName || event.city || 'Location not specified'}
          </Typography>
        </Stack>

        {/* Meeting Link - only show for virtual/hybrid events */}
        {(event.eventType === 'virtual' || event.eventType === 'hybrid') && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <VideocamIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            {event.meetingLink ? (
              <Button
                variant="text"
                size="small"
                href={event.meetingLink}
                target="_blank"
                sx={{
                  p: 0,
                  minWidth: 'auto',
                  color: 'primary.main',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                Join Meeting
              </Button>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                Meeting link not available yet
              </Typography>
            )}
          </Stack>
        )}
      </Stack>
    );
  };

  // Move getLocationInfo before using it
  const locationInfo = getLocationInfo();

  // Add debug logs
  console.log('Event data:', {
    id: event.id,
    type: event.eventType,
    venue: event.venueName,
    city: event.city,
    location: locationInfo,
  });

  // Only show meeting link section for virtual/hybrid events
  const showMeetingLink = ['virtual', 'hybrid'].includes(event.eventType?.toLowerCase());

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        bgcolor: 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        },
        borderRadius: 2,
        height: '100%',
      }}
    >
      {/* Top Section with Category and Price */}
      <Box
        sx={{
          p: 2,
          pb: 1,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Chip
          label={event.category}
          size="small"
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'grey.100',
            color: 'text.primary',
            fontWeight: 500,
            height: '24px',
          }}
        />
        <Chip
          label={event.isPaid ? formatPrice(event.price || 0, event.currency) : 'Free'}
          color={event.isPaid ? 'primary' : 'success'}
          size="small"
          sx={{
            fontWeight: 600,
            height: '24px',
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 2, pt: 1.5, flexGrow: 1 }}>
        {/* Title */}
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{
            fontSize: '1.1rem',
            fontWeight: 600,
            mb: 2,
            color: 'text.primary',
          }}
        >
          {event.title}
        </Typography>

        {/* Event Info List */}
        <Stack spacing={1.5}>
          {/* Type */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ fontSize: '1.2rem', width: 24, textAlign: 'center' }}>{typeInfo.icon}</Box>
            <Typography variant="body2" color="text.secondary">
              {typeInfo.text} Event
            </Typography>
          </Stack>

          {/* Date and Time */}
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary', width: 24 }} />
            <Typography variant="body2" color="text.secondary">
              {datetime.date} • {datetime.time}
            </Typography>
          </Stack>

          {/* Location */}
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnIcon sx={{ fontSize: 20, color: 'text.secondary', width: 24 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {event.venueName && event.city
                ? `${event.venueName}, ${event.city}`
                : event.venueName || event.city || 'Location not specified'}
            </Typography>
          </Stack>

          {/* Meeting Link for Virtual/Hybrid */}
          {showMeetingLink && (
            <Stack direction="row" spacing={1} alignItems="center">
              <VideocamIcon sx={{ fontSize: 20, color: 'text.secondary', width: 24 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  cursor: event.meetingLink ? 'pointer' : 'default',
                  '&:hover': event.meetingLink
                    ? {
                        color: 'primary.dark',
                        textDecoration: 'underline',
                      }
                    : {},
                }}
                onClick={() => event.meetingLink && window.open(event.meetingLink, '_blank')}
              >
                {event.meetingLink ? 'Join online meeting' : 'Unavailable'}
              </Typography>
            </Stack>
          )}

          {/* Spots */}
          <Stack direction="row" spacing={1} alignItems="center">
            <GroupIcon sx={{ fontSize: 20, color: 'text.secondary', width: 24 }} />
            <Typography variant="body2" color="text.secondary">
              {getSpotsText()}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Action Button */}
      <Box
        sx={{
          p: 2,
          pt: 0,
          mt: 'auto',
          textAlign: 'center',
        }}
      >
        <Button
          variant="contained"
          disabled={buttonState.disabled}
          onClick={!isAuthenticated ? handleJoinClick : () => router.push(`/events/${event.id}`)}
          sx={{
            minWidth: '140px',
            height: '36px',
            px: 3,
            borderRadius: '20px',
            fontSize: '0.875rem',
            letterSpacing: '0.02em',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'translateY(-1px)',
              boxShadow: (theme) => theme.shadows[2],
            },
          }}
        >
          {buttonState.text}
        </Button>
      </Box>
    </Card>
  );
};
