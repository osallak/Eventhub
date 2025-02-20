import { Box, Container, Typography } from '@mui/material';
import { EventCard } from '../discover/EventCard';
import { type EventCategory } from '../../types/categories';

interface DiscoverEventsSectionProps {
  events: Array<{
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
    isFull: boolean;
  }>;
}

export const DiscoverEventsSection = ({ events }: DiscoverEventsSectionProps) => {
  return (
    <Box
      sx={{
        py: 8,
        width: '100vw',
        position: 'relative',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth={false}>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: 700, px: { xs: 2, sm: 4, md: 8 }, color: 'text.primary' }}
        >
          Discover events
        </Typography>

        {/* Scroll Container */}
        <Box
          sx={{
            position: 'relative',
            padding: { xs: 2, sm: 4, md: 8 },
            overflowX: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {/* Wrapper for infinite scroll */}
          <Box
            sx={{
              display: 'flex',
              width: 'fit-content',
              gap: 3,
              animation: 'scroll 40s linear infinite',
              '@keyframes scroll': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(calc(-320px * 5 - 1.5rem * 5))' },
              },
              '&:hover': {
                animationPlayState: 'paused',
              },
            }}
          >
            {/* Card template - will be repeated for all sets */}
            {[...Array(4)].map((_, setIndex) => (
              <Box key={`set-${setIndex}`} sx={{ display: 'flex', gap: 3 }}>
                {events.map((event, index) => (
                  <Box
                    key={`${setIndex}-${index}`}
                    sx={{
                      width: 320,
                      flex: 'none',
                    }}
                  >
                    <EventCard event={event} />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}; 