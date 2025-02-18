import { Routes } from '@common/constants/routes';
import useAuth from '@modules/auth/hooks/api/useAuth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { type EventCategory } from '../../types/categories';
import { formatPrice } from '../../utils/formatters';
import { EventActions } from './EventActions';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    category: EventCategory;
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
  const { t, i18n } = useTranslation('events', {
    useSuspense: false,
  });
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Simplified debug log with available methods
  console.log('Translation debug:', {
    currentLocale: i18n.language,
    currentNamespace: i18n.options?.defaultNS,
    joinTranslation: t('actions.join'),
    allTranslations: i18n.store?.data,
  });

  // Check if event is in the past
  const isPastEvent = dayjs(event.startDate).isBefore(dayjs(), 'day');

  // Helper to get event type icon and text
  const getEventTypeInfo = (type: 'physical' | 'virtual' | 'hybrid') => {
    switch (type) {
      case 'physical':
        return { icon: '🏠', text: t('type.physical') };
      case 'virtual':
        return { icon: '💻', text: t('type.virtual') };
      default:
        return { icon: '🌐', text: t('type.hybrid') };
    }
  };

  const typeInfo = getEventTypeInfo(event.eventType);
  const hasLimitedSpots = event.maxParticipants !== undefined;
  const spotsLeft = hasLimitedSpots
    ? event.maxParticipants! - (event.currentParticipants || 0)
    : undefined;

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
      return t('actions.login_to_join');
    }
    if (event.isParticipant) {
      return t('actions.already_joined');
    }
    if (isPastEvent) {
      return t('actions.ended');
    }
    if (event.isFull) {
      return t('actions.full');
    }
    if (event.isOwner) {
      return t('actions.you_are_owner');
    }
    return t('actions.join');
  };

  const getButtonProps = () => {
    const baseProps = {
      variant: 'contained' as const,
      fullWidth: true,
      sx: {
        mt: 'auto',
        borderRadius: '20px',
        textTransform: 'none',
        py: 1,
      },
    };

    if (!isAuthenticated) {
      return {
        ...baseProps,
        onClick: () =>
          router.push(`${Routes.Auth.Login}?returnUrl=${encodeURIComponent(router.asPath)}`),
      };
    }

    return {
      ...baseProps,
      onClick: handleJoinClick,
      disabled: event.isFull || isPastEvent || event.isParticipant || event.isOwner,
    };
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

  // Fix the spots translation
  const getSpotsText = () => {
    if (hasLimitedSpots) {
      return t('actions.spots_left', { count: spotsLeft });
    }
    return t('actions.unlimited_spots');
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
            label={t('price.free')}
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
        label={t(`categories.${event.category}`)}
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

      {/* Join Button with updated props */}
      <Button {...getButtonProps()}>{getButtonText()}</Button>

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
