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
  CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useAuth from '@modules/auth/hooks/useAuth';
import { Routes } from '@common/constants/routes';
import { User } from '@modules/users/defs/types';

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
    id: index.toString(),
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

// Update mockUser type to match User interface
const mockUser: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  email: 'john.doe@example.com',
  name: 'John Doe',
  avatarUrl: null,
  emailVerifiedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdEvents: mockEvents.map((event) => ({
    ...event,
    id: parseInt(event.id),
    description: '',
    endTime: '20:00',
    hideAddress: false,
  })),
};

const Profile = () => {
  const router = useRouter();
  const { username } = router.query;
  const { user, isAuthenticated, initialized } = useAuth();
  const { t } = useTranslation();

  // Get the actual user data from the nested structure
  const actualUser = user?.data || user;

  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // If username is in the URL, it's a public view
  const isPublicView = Boolean(username);

  // Update userData when user data is available
  useEffect(() => {
    if (isPublicView) {
      // TODO: Fetch public profile data from API
      // For now, show error or redirect
      router.replace('/404');
    } else if (actualUser) {
      setUserData(actualUser);
    }
  }, [isPublicView, actualUser, router]);

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        email: userData.email || '',
      });
    }
  }, [userData]);

  // Show loading state if no userData yet
  if (!userData) {
    return <LoadingScreen />;
  }

  // Filter events from userData
  const filteredEvents = (userData?.createdEvents || []).filter((event) => {
    if (eventFilter === 'all') {
      return true;
    }
    const eventDate = dayjs(event.startDate);
    const now = dayjs();
    return eventFilter === 'upcoming' ? eventDate.isAfter(now) : eventDate.isBefore(now);
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
                    src={userData?.avatarUrl || undefined}
                  >
                    {userData?.name ? userData.name[0].toUpperCase() : '?'}
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
                    placeholder={t('Enter your first name')}
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
                    placeholder={t('Enter your last name')}
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
                    placeholder={t('Enter your username')}
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
                    placeholder={t('Enter your email')}
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
                {filteredEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <EventCard event={event} isOwner={true} />
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

// Add LoadingScreen component
const LoadingScreen = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);

const ProfilePage = () => {
  const { isAuthenticated, initialized, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!isAuthenticated) {
      const currentPath = router.asPath;
      const loginUrl = `${Routes.Auth.Login}?returnUrl=${encodeURIComponent(currentPath)}`;
      router.replace(loginUrl);
    }
  }, [isAuthenticated, initialized, router, user]);

  if (!initialized || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return <Profile />;
};

export default ProfilePage;
