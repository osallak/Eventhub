import { Box, Container, Grid, Typography } from '@mui/material';
import { EventCard } from './EventCard';
import { useTranslation } from 'next-i18next';

interface DiscoverEventsSectionProps {
  events: Array<{
    id: string;
    title: string;
    category: string;
    eventType: 'physical' | 'virtual' | 'hybrid';
    isPaid: boolean;
    price?: number;
    currency?: string;
    startDate: string;
    startTime: string;
    city: string;
    maxParticipants: number;
    currentParticipants: number;
    isFull: boolean;
    isOwner?: boolean;
    isParticipant?: boolean;
  }>;
}

export const DiscoverEventsSection = ({ events }: DiscoverEventsSectionProps) => {
  const { t } = useTranslation('events');
  
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          {t('discover.title')}
        </Typography>
        <Grid container spacing={3}>
          {events.map((event, index) => (
            <Grid item xs={12} sm={6} md={4} key={event.id || index}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}; 