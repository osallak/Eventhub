import { Box, Container, Paper, Stepper, Step, StepLabel, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicInfoStep } from '@modules/events/components/create/BasicInfoStep';
import { DateTimeStep } from '@modules/events/components/create/DateTimeStep';
import { LocationStep } from '@modules/events/components/create/LocationStep';
import { DetailsStep } from '@modules/events/components/create/DetailsStep';
import { EventFormData } from '@modules/events/types/form';

// Step components will be created separately
const steps = ['Basic Info', 'Date & Time', 'Location', 'Details & Rules', 'Review'];

const CreateEvent = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<EventFormData>({});

  const handleFormChange = (field: keyof EventFormData, value: any) => {
    console.group('CreateEvent: Form Update');

    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
    console.groupEnd();
  };

  const handleNext = () => {
    const locationData = {
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      coordinates: formData.coordinates,
    };

    const hasValidLocation = Boolean(
      locationData.coordinates && locationData.address && locationData.city
    );

    console.log('Location validation:', {
      step: steps[activeStep],
      hasValidLocation,
      locationData,
      currentFormData: formData,
      isLocationStep: activeStep === 2,
    });

    if (!hasValidLocation && activeStep === 2) {
      console.warn('Proceeding without valid location data:', locationData);
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    const commonProps = {
      formData,
      onFormChange: handleFormChange as (field: string, value: any) => void,
    };

    switch (activeStep) {
      case 0:
        return <BasicInfoStep {...commonProps} />;
      case 1:
        return <DateTimeStep {...commonProps} />;
      case 2:
        return <LocationStep {...commonProps} />;
      case 3:
        return <DetailsStep {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: 'text.primary',
            fontSize: {
              xs: '1.75rem',
              sm: '2rem',
            },
          }}
        >
          {t('Create New Event')}
        </Typography>

        {/* Stepper */}
        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            mb: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: 'text.secondary',
                '&.Mui-active': {
                  color: 'text.primary',
                },
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{t(label)}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Form Content */}
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            minHeight: '400px',
          }}
        >
          {renderStepContent()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              {t('Back')}
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 2 ? t('Finish') : t('Next')}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateEvent;
