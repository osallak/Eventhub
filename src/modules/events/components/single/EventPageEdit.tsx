import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { BasicInfoStep } from '@modules/events/components/create/BasicInfoStep';
import { Event } from '../../types/event';
import { EventDateTime } from './sections/EventDateTime';
import { EventDetails } from './sections/EventDetails';
import { EventLocation } from './sections/EventLocation';
import { EventParticipants } from './sections/EventParticipants';

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
  const theme = useTheme();

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
        {/* Basic Info Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <BasicInfoStep
            formData={editedEvent}
            onFormChange={(field, value) => {
              setEditedEvent({ ...editedEvent, [field]: value });
            }}
            onValidationChange={() => {}} // We'll handle validation at the form level
          />
        </Paper>

        {/* Date and Time Section */}
        <EventDateTime
          event={editedEvent}
          isEditing
          onEdit={(dateTime) => {
            setEditedEvent({ ...editedEvent, ...dateTime });
          }}
        />

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
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  borderRadius: '4px',
                  resize: 'vertical',
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  fontFamily: theme.typography.fontFamily,
                }}
              />
            </Paper>

            <EventLocation
              event={editedEvent}
              isEditing={true}
              onEdit={(location) => {
                setEditedEvent({ ...editedEvent, ...location });
              }}
            />

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
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  borderRadius: '4px',
                  resize: 'vertical',
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  fontFamily: theme.typography.fontFamily,
                }}
              />
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 88 }}>
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

        {/* Action Buttons at Bottom */}
        <Paper
          elevation={2}
          sx={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            py: 2,
            px: 3,
            mt: 4,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
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
        </Paper>
      </Container>
    </Box>
  );
};
