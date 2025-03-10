import { ErrorAlert } from '@common/components/ErrorAlert';
import { LoadingOverlay } from '@common/components/LoadingOverlay';
import { Routes } from '@common/constants/routes';
import useAuth from '@modules/auth/hooks/useAuth';
import { BasicInfoStep } from '@modules/events/components/create/BasicInfoStep';
import { DateTimeStep } from '@modules/events/components/create/DateTimeStep';
import { DetailsStep } from '@modules/events/components/create/DetailsStep';
import { InviteStep } from '@modules/events/components/create/InviteStep';
import { LocationStep } from '@modules/events/components/create/LocationStep';
import { StepWrapper } from '@modules/events/components/create/StepWrapper';
import { createEvent } from '@modules/events/services/eventService';
import { EventFormData } from '@modules/events/types/form';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, Container, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import useApi from '@common/hooks/useApi';

const steps = ['Basic Info', 'Date & Time', 'Location', 'Details & Rules', 'Invite People'];

interface CreateEventProps {
  mode?: 'create' | 'edit';
}

const CreateEvent = ({ mode = 'create' }: CreateEventProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<EventFormData>({});
  const [stepsValidation, setStepsValidation] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchApi = useApi();
  const { user, token } = useAuth();

  useEffect(() => {
    if (mode === 'edit' && id) {
      // TODO: Fetch event data and populate formData
    }
  }, [mode, id]);

  const handleFormChange = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    console.group('CreateEvent: Form Update');
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.groupEnd();
  };

  const handleNext = () => {
    if (activeStep === 4) {
      handleSubmit(formData);
    } else if (stepsValidation[activeStep] || activeStep === 3) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleValidationChange = (isValid: boolean) => {
    setStepsValidation((prev) => ({
      ...prev,
      [activeStep]: isValid,
    }));
  };

  const getStepContent = (step: number) => {
    const commonProps = {
      formData,
      onFormChange: handleFormChange,
      onValidationChange: handleValidationChange,
    };

    switch (step) {
      case 0:
        return <BasicInfoStep {...commonProps} />;
      case 1:
        return <DateTimeStep {...commonProps} />;
      case 2:
        return <LocationStep {...commonProps} />;
      case 3:
        return <DetailsStep {...commonProps} />;
      case 4:
        return <InviteStep {...commonProps} />;
      default:
        return 'Unknown step';
    }
  };

  const getSuccessContent = () => (
    <Box
      sx={{
        textAlign: 'center',
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: 'success.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
      </Box>
      <Typography variant="h5" color="text.primary" gutterBottom>
        Event Created Successfully!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        You will receive a notification 30 minutes before the event starts.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => router.push('/events')}>
          View All Events
        </Button>
        <Button variant="contained" onClick={() => router.push('/events/created')}>
          View Event
        </Button>
      </Stack>
    </Box>
  );

  const navigationButtons = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
        Back
      </Button>
      <Box sx={{ flex: '1 1 auto' }} />
      <Button onClick={handleNext} disabled={!stepsValidation[activeStep] && activeStep < 3}>
        {activeStep === 4 ? 'Finish' : 'Next'}
      </Button>
    </Box>
  );

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get token directly from localStorage like in edit.tsx
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      await createEvent(fetchApi, formData, token);

      enqueueSnackbar('Event created successfully', {
        variant: 'success',
      });

      setIsSubmitted(true);
    } catch (err: any) {
      if (err.type === 'validation') {
        const firstError = Object.entries(err.errors || {})[0];
        if (firstError) {
          const [field, messages] = firstError as [string, string[]];
          enqueueSnackbar(`${field}: ${messages[0]}`, {
            variant: 'error',
          });
        }
      } else {
        setError(err.message || 'Failed to create event. Please try again.');
        enqueueSnackbar(err.message || 'Failed to create event. Please try again.', {
          variant: 'error',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 4, md: 6 },
        mt: { xs: 2, md: 4 },
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: {
          sm: '600px',
          md: '800px',
        },
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 4, md: 5 },
          mt: 2,
          fontWeight: 700,
          color: 'text.primary',
          fontSize: {
            xs: '1.75rem',
            sm: '2rem',
          },
        }}
      >
        {mode === 'edit' ? 'Edit Event' : 'Create Event'}
      </Typography>

      <Box
        sx={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { sm: '600px', md: '800px' },
          }}
        >
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              width: '100%',
            }}
            orientation="horizontal"
            alternativeLabel
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      mt: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <StepWrapper actions={!isSubmitted ? navigationButtons : null}>
            {isSubmitted ? getSuccessContent() : getStepContent(activeStep)}
          </StepWrapper>
        </Box>
      </Box>
      {/* Add loading state and error display to your form */}
      {isSubmitting && <LoadingOverlay />}
      {error && <ErrorAlert message={error} />}
    </Container>
  );
};

const CreateEventPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = router.asPath;
      const loginUrl = `${Routes.Auth.Login}?returnUrl=${encodeURIComponent(currentPath)}`;
      router.replace(loginUrl);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <CreateEvent />
    </Container>
  );
};

export default CreateEventPage;
