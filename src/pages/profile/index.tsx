import { Topbar } from '@common/layout/Topbar';
import { EventCard } from '@modules/events/components/discover/EventCard';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Container,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { withAuth } from '@modules/auth/hocs/withAuth';
import { AUTH_MODE } from '@modules/auth/types/auth.types';
import { Routes } from '@common/constants/routes';

type EventType = 'physical' | 'virtual' | 'hybrid';

// Add mock events
const mockEvents = [...Array(6)].map((_, index) => {
  const eventType = (() => {
    if (index % 3 === 0) {
      return 'physical' as EventType;
    }
    if (index % 3 === 1) {
      return 'virtual' as EventType;
    }
    return 'hybrid' as EventType;
  })();

  return {
    title: `Event ${index + 1}`,
    category: 'Sports & Fitness',
    eventType,
    isPaid: index % 2 === 0,
    price: index % 2 === 0 ? 10 + index : undefined,
    currency: 'USD',
    startDate: dayjs()
      .add(index % 2 === 0 ? -index : index, 'days')
      .toISOString(),
    startTime: '19:00',
    city: `City ${(index % 3) + 1}`,
    maxParticipants: 20,
    currentParticipants: 8 + (index % 5),
    isFull: 8 + (index % 5) >= 20,
  };
});

// Update mockUser
const mockUser = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john.doe@example.com',
  avatarUrl: null,
  createdEvents: mockEvents,
};

const Profile = () => {
  const router = useRouter();
  const { username } = router.query;

  // If username is in the URL, it's a public view
  const isPublicView = Boolean(username);

  // If it's public view, we should fetch that user's data
  const [userData, setUserData] = useState(mockUser);

  useEffect(() => {
    if (isPublicView) {
      // In real app: fetch user data by username
      // For now, just use mock data
      setUserData(mockUser);
    }
  }, [isPublicView]);

  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Update form state to use userData
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    username: userData.username,
    email: userData.email,
  });

  // Add form handlers
  const handleInputChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      // Update mock user
      Object.assign(userData, formData);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  // Add filter function
  const filteredEvents = userData.createdEvents.filter((event) => {
    if (eventFilter === 'all') {
      return true;
    }
    const eventDate = dayjs(event.startDate);
    const now = dayjs();
    return eventFilter === 'upcoming' ? eventDate.isAfter(now) : eventDate.isBefore(now);
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        bgcolor: 'inherit',
      }}
    >
      <Topbar isLandingPage={false} scrollProgress={1} />
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          mt: { xs: 6, sm: 8 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          {t('Profile')}
        </Typography>

        <Stack spacing={4}>
          {/* Profile Form */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 3,
              boxShadow: (theme) => theme.shadows[1],
            }}
          >
            <Stack spacing={3}>
              {/* Avatar with Upload Overlay */}
              <Stack alignItems="center" spacing={3}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                    }}
                    src={userData.avatarUrl || undefined}
                  >
                    {userData.firstName[0]}
                    {userData.lastName[0]}
                  </Avatar>
                  {isEditing && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '50%',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'white',
                          textAlign: 'center',
                          px: 1,
                        }}
                      >
                        {t('Upload Photo')}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Edit Button */}
                <LoadingButton
                  loading={isSaving}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  sx={{ minWidth: 150 }} // Ensure consistent width
                >
                  {isEditing ? t('Save Changes') : t('Edit Profile')}
                </LoadingButton>
              </Stack>

              {/* Form Fields */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t('First Name')}
                    fullWidth
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    disabled={!isEditing}
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={t('Last Name')}
                    fullWidth
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    disabled={!isEditing}
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t('Username')}
                    fullWidth
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    disabled={!isEditing}
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t('Email')}
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    disabled={!isEditing}
                    type="email"
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Box>

          {/* Created Events */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {t('Created Events')}
              </Typography>
              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                <Select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value as typeof eventFilter)}
                >
                  <MenuItem value="all">{t('All Events')}</MenuItem>
                  <MenuItem value="upcoming">{t('Upcoming')}</MenuItem>
                  <MenuItem value="past">{t('Past')}</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {filteredEvents.length > 0 ? (
              <Grid container spacing={3}>
                {filteredEvents.map((event, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <EventCard event={event} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  py: 4,
                }}
              >
                {t('No events found')}
              </Typography>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default withAuth(Profile, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
