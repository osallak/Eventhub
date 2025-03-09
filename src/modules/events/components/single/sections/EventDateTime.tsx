import { Paper, Typography, Box, TextField } from '@mui/material';
import { Event } from '../../../types/event';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import { DateTimeStep } from '../../create/DateTimeStep';

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

  if (isEditing && onEdit) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Date and Time
        </Typography>
        <DateTimeStep
          formData={event}
          onFormChange={(field, value) => {
            onEdit({ [field]: value });
          }}
          onValidationChange={() => {}} // We'll handle validation at the form level
        />
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
