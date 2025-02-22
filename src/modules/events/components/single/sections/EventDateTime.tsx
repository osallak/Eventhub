import { Paper, Typography, Box, TextField } from '@mui/material';
import { Event } from '../../../types/event';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';

// Add plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface EventDateTimeProps {
  event: Event;
  isEditing?: boolean;
  onEdit?: (dateTime: Partial<Event>) => void;
}

export const EventDateTime = ({ event, isEditing, onEdit }: EventDateTimeProps) => {
  const formatDateTime = (dateStr: string, startTimeStr: string, endTimeStr: string) => {
    const date = dayjs(dateStr);
    const startTime = dayjs(startTimeStr);
    const endTime = dayjs(endTimeStr);

    return {
      date: date.format('dddd, MMMM D, YYYY'),
      time: `${startTime.format('h:mm A')} - ${endTime.format('h:mm A')}`,
    };
  };

  const datetime = formatDateTime(event.startDate, event.startTime, event.endTime);

  if (isEditing) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Date & Time
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={dayjs(event.startDate).format('YYYY-MM-DD')}
            onChange={(e) => onEdit?.({ startDate: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Start Time"
            type="time"
            value={dayjs(event.startTime).format('HH:mm')}
            onChange={(e) =>
              onEdit?.({
                startTime: `${dayjs(event.startDate).format('YYYY-MM-DD')}T${
                  e.target.value
                }:00.000Z`,
              })
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Time"
            type="time"
            value={dayjs(event.endTime).format('HH:mm')}
            onChange={(e) =>
              onEdit?.({
                endTime: `${dayjs(event.startDate).format('YYYY-MM-DD')}T${e.target.value}:00.000Z`,
              })
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Timezone"
            value={event.timezone}
            onChange={(e) => onEdit?.({ timezone: e.target.value })}
            fullWidth
          />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Date & Time
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CalendarTodayIcon sx={{ mr: 2, color: 'text.secondary' }} />
        <Typography>{datetime.date}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AccessTimeIcon sx={{ mr: 2, color: 'text.secondary' }} />
        <Typography>{datetime.time}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <PublicIcon sx={{ mr: 2, color: 'text.secondary' }} />
        <Typography>{event.timezone || 'UTC'}</Typography>
      </Box>
    </Paper>
  );
};
