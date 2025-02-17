import { Card, Chip, Stack, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/formatters';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import dayjs from 'dayjs';
import { useAuth } from '@modules/auth/contexts/AuthContext';
import { Routes } from '@common/constants/routes';
import { useRouter } from 'next/router';

interface EventCardProps {
  event: {
    title: string;
    category: string;
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
  };
}

export const EventCard = ({ event }: EventCardProps) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Helper to get event type icon and text
  const getEventTypeInfo = (type: 'physical' | 'virtual' | 'hybrid') => {
    switch (type) {
      case 'physical':
        return { icon: '🏠', text: t('In Person') };
      case 'virtual':
        return { icon: '💻', text: t('Online') };
      default:
        return { icon: '🌐', text: t('Hybrid') };
    }
  };

  const typeInfo = getEventTypeInfo(event.eventType);
  const hasLimitedSpots = event.maxParticipants !== undefined;
  const spotsLeft = hasLimitedSpots
    ? event.maxParticipants! - (event.currentParticipants || 0)
    : undefined;

  // Check if event is in the past
  const isPastEvent = dayjs(event.startDate).isBefore(dayjs(), 'day');

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      router.push(`${Routes.Auth.Login}?returnUrl=${encodeURIComponent(router.asPath)}`);
    } else {
      // Existing join logic
      console.log('Joining event...');
    }
  };

  const getButtonText = () => {
    if (!isAuthenticated) {
      return 'Login to Join';
    }
    if (isPastEvent) {
      return 'Event Ended';
    }
    if (event.isFull) {
      return 'Event Full';
    }
    return 'Join Event';
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
            label={t('FREE')}
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
        label={t(event.category)}
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
            {hasLimitedSpots ? `${spotsLeft} ${t('spots left')}` : t('Unlimited spots')}
          </Typography>
        </Stack>
      </Stack>

      {/* Join Button */}
      <Button
        onClick={handleJoinClick}
        variant="contained"
        disabled={event.isFull || isPastEvent}
        fullWidth
        sx={{
          mt: 'auto',
          borderRadius: '20px',
          textTransform: 'none',
          py: 1,
        }}
      >
        {getButtonText()}
      </Button>
    </Card>
  );
};
