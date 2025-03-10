import useApi from '@common/hooks/useApi';
import { useAuth } from '@modules/auth/hooks/useAuth';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EventPage } from '../../modules/events/components/single/EventPage';
import { Event } from '../../modules/events/types/event';
import { useSnackbar } from 'notistack';

interface EventPageProps {
  initialEvent: Event;
}

const SingleEventPage = ({ initialEvent }: EventPageProps) => {
  const auth = useAuth();
  const router = useRouter();
  const api = useApi();
  const { enqueueSnackbar } = useSnackbar();

  const [event, setEvent] = useState<Event>(initialEvent);
  const isOwner = auth.user?.id === event?.creator?.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login to join events', { variant: 'error' });
        return;
      }

      const response = await fetch(
        new URL(`/api/events/${event.id}/join`, process.env.NEXT_PUBLIC_API_URL).toString(),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        const updatedEvent = await refreshEventData();
        if (updatedEvent) {
          setEvent(updatedEvent);
          enqueueSnackbar('Successfully joined event!', { variant: 'success' });
        }
      } else {
        enqueueSnackbar(data.message || 'Failed to join event', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error joining event:', error);
      enqueueSnackbar('An error occurred while joining the event', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEventData = async () => {
    try {
      const response = await fetch(
        new URL(`/api/events/${event.id}`, process.env.NEXT_PUBLIC_API_URL).toString(),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        return data.data;
      }
    } catch (error) {
      console.error('Failed to refresh event data:', error);
    }
    return null;
  };

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        enqueueSnackbar('Please login to leave events', { variant: 'error' });
        return;
      }

      const response = await fetch(
        new URL(`/api/events/${event.id}/leave`, process.env.NEXT_PUBLIC_API_URL).toString(),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        const updatedEvent = await refreshEventData();
        if (updatedEvent) {
          setEvent(updatedEvent);
          enqueueSnackbar('Successfully left event', { variant: 'success' });
        }
      } else {
        enqueueSnackbar(data.message || 'Failed to leave event', { variant: 'error' });
      }
    } catch (error) {
      console.error('Failed to leave event:', error);
      enqueueSnackbar('Failed to leave event', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/events/${event.id}/edit`);
  };

  if (!event || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <EventPage
      event={event}
      isOwner={isOwner}
      onJoin={handleJoin}
      onLeave={handleLeave}
      onEdit={handleEdit}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  if (!id) {
    return { notFound: true };
  }

  try {
    const url = new URL('/api/events/' + id, process.env.NEXT_PUBLIC_API_URL).toString();
    const response = await fetch(url);
    
    const data = await response.json();


    if (!response.ok) {
      console.error('Server response not OK:', data);
      return { notFound: true };
    }

    if (!data || !data.data) {
      console.error('Invalid data structure:', data);
      return { notFound: true };
    }

    return {
      props: {
        initialEvent: data.data,
      },
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return { notFound: true };
  }
};

export default SingleEventPage;
