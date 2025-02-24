import { LoadingOverlay } from '@common/components/LoadingOverlay';
import { Topbar } from '@common/layout/Topbar';
import { useAuth } from '@modules/auth/hooks/useAuth';
import { EventPageEdit } from '@modules/events/components/single/EventPageEdit';
import { Event } from '@modules/events/types/event';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

const EditEventPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    let mounted = true;

    const fetchEvent = async () => {
      if (!id || !mounted) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          enqueueSnackbar(t('Authentication required'), { variant: 'error' });
          router.push('/auth/login');
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '')}/api/events/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log('API Response:', data);
        if (!mounted) {
          return;
        }

        if (!data.status || data.status !== 'success') {
          enqueueSnackbar(t('Event not found'), { variant: 'error' });
          router.push('/events');
          return;
        }

        const eventData = data.data as Event;

        console.log('Debug ownership check:', {
          userId: user?.id,
          creatorId: eventData?.creator?.id,
          eventData,
          user,
        });

        const isOwner = user?.id === eventData?.creator?.id;
        console.log('Is owner:', isOwner);

        if (!isOwner) {
          enqueueSnackbar(t('You are not authorized to edit this event'), { variant: 'error' });
          router.push(`/events/${id}`);
          return;
        }

        setEvent(eventData);
      } catch (error) {
        if (!mounted) return;
        console.error('Failed to fetch event:', error);
        enqueueSnackbar(t('Failed to fetch event'), { variant: 'error' });
        router.push('/events');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (isAuthenticated && id) {
      fetchEvent();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSave = async (updatedEvent: Event) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar(t('Authentication required'), { variant: 'error' });
        return;
      }

      // Format the times to only include hours and minutes
      const formattedEvent = {
        ...updatedEvent,
        startTime: dayjs(updatedEvent.startTime).format('HH:mm'),
        endTime: dayjs(updatedEvent.endTime).format('HH:mm'),
        startDate: dayjs(updatedEvent.startDate).format('YYYY-MM-DD'),
        // Handle max participants as a number
        maxParticipants:
          typeof updatedEvent.maxParticipants === 'undefined' ||
          updatedEvent.maxParticipants === null ||
          updatedEvent.maxParticipants === ''
            ? -1 // Use -1 for infinite
            : Number(updatedEvent.maxParticipants), // Ensure it's a number
      };

      console.log('Sending event data:', formattedEvent); // Debug log

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '')}/api/events/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedEvent),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        enqueueSnackbar(t('Event updated successfully'), { variant: 'success' });
        router.push(`/events/${id}`);
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      enqueueSnackbar(t('Failed to update event'), { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!event) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar(t('Authentication required'), { variant: 'error' });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '')}/api/events/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        enqueueSnackbar(t('Event deleted successfully'), { variant: 'success' });
        router.push('/events');
      } else {
        throw new Error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      enqueueSnackbar(t('Failed to delete event'), { variant: 'error' });
    }
  };

  const handleCancel = () => {
    router.push(`/events/${id}`);
  };

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (!event) {
    return null;
  }

  return (
    <Box>
      <Topbar isLandingPage={false} scrollProgress={1} />
      <EventPageEdit
        event={event}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default EditEventPage;
