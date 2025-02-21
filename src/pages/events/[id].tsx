import { GetServerSideProps } from 'next';
import { EventPage } from '../../modules/events/components/single/EventPage';
import { Event } from '../../modules/events/types/event';
import { useAuth } from '../../modules/auth/hooks/useAuth';
import { withAuth } from '../../modules/auth/hocs/withAuth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import useApi from '@common/hooks/useApi';
import { AUTH_MODE } from '../../modules/auth/types/auth.types';

interface EventPageProps {
  initialEvent: Event; // renamed to indicate it's initial data
}

const SingleEventPage = ({ initialEvent }: EventPageProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const api = useApi();
  const [event, setEvent] = useState<Event>(initialEvent);
  const isOwner = user?.id === event.creator?.id;

  // Fetch fresh event data when needed (after join/leave)
  const refreshEventData = async () => {
    try {
      const response = await api(`/events/${event.id}`);
      if (response.success) {
        setEvent(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh event data:', error);
    }
  };

  const handleJoin = async () => {
    try {
      const response = await api(`/events/${event.id}/join`, {
        method: 'POST',
        displaySuccess: true,
      });
      if (response.success) {
        await refreshEventData();
      }
    } catch (error) {
      console.error('Failed to join event:', error);
    }
  };

  const handleLeave = async () => {
    try {
      const response = await api(`/events/${event.id}/leave`, {
        method: 'POST',
        displaySuccess: true,
      });
      if (response.success) {
        await refreshEventData();
      }
    } catch (error) {
      console.error('Failed to leave event:', error);
    }
  };

  const handleEdit = () => {
    router.push(`/events/${event.id}/edit`);
  };

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

  try {
    // Using fetch for SSR since we can't use hooks here
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`);
    const data = await response.json();

    if (!data || data.status === 'error') {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        initialEvent: data.data, // renamed to match the prop name
      },
    };
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return {
      notFound: true,
    };
  }
};

export default withAuth(SingleEventPage, {
  mode: AUTH_MODE.OPTIONAL,
  redirectUrl: '/auth/login',
});
