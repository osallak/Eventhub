import { Box, Container, Grid, Paper, Typography, Button, Stack } from '@mui/material';
import { Event } from '../../types/event';
import { useState } from 'react';
import { EventDateTime } from './sections/EventDateTime';
import { EventLocation } from './sections/EventLocation';
import { EventDetails } from './sections/EventDetails';
import { EventParticipants } from './sections/EventParticipants';
import { EventHeader } from './sections/EventHeader';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

interface EventPageEditProps {
  event: Event;
  onSave: (updatedEvent: Event) => Promise<void>;
  onDelete: () => Promise<void>;
  onCancel: () => void;
}

export const EventPageEdit = ({ event, onSave, onDelete, onCancel }: EventPageEditProps) => {
  const [editedEvent, setEditedEvent] = useState<Event>(event);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedEvent);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        py: { xs: 2, md: 3 },
        px: { xs: 2, md: 0 },
        mt: { xs: 7, md: 8.5 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        {/* Fixed Action Bar */}
        <Paper
          elevation={2}
          sx={{
            position: 'sticky',
            top: 64,
            zIndex: 1100,
            py: 2,
            px: 3,
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 0,
          }}
        >
          <Typography variant="h6">Editing Event</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete Event
            </Button>
            <Button variant="outlined" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSaving}
            >
              Save Changes
            </Button>
          </Stack>
        </Paper>

        {/* Event Content */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
          <EventHeader
            event={editedEvent}
            isOwner={true}
            hasJoined={false}
            isEditing={true}
          />
        </Paper>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                About this event
              </Typography>
              <textarea
                value={editedEvent.description}
                onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'vertical',
                }}
              />
            </Paper>

            <EventLocation event={editedEvent} isEditing={true} onEdit={(location) => {
              setEditedEvent({ ...editedEvent, ...location });
            }} />

            {/* Rules Section */}
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
              {/* Add editable rules section */}
            </Paper>

            {/* Notes Section */}
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Additional Notes
              </Typography>
              <textarea
                value={editedEvent.notes || ''}
                onChange={(e) => setEditedEvent({ ...editedEvent, notes: e.target.value })}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'vertical',
                }}
              />
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 88 }}>
              <EventDateTime
                event={editedEvent}
                isEditing={true}
                onEdit={(dateTime) => {
                  setEditedEvent({ ...editedEvent, ...dateTime });
                }}
              />
              <EventDetails
                event={editedEvent}
                isEditing={true}
                onEdit={(details) => {
                  setEditedEvent({ ...editedEvent, ...details });
                }}
              />
              <EventParticipants
                participants={editedEvent.participants || []}
                maxParticipants={editedEvent.maxParticipants}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
