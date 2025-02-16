import { BasicInfoStep } from '@modules/events/components/create/BasicInfoStep';
import { DateTimeStep } from '@modules/events/components/create/DateTimeStep';
import { DetailsStep } from '@modules/events/components/create/DetailsStep';
import { LocationStep } from '@modules/events/components/create/LocationStep';
import { StepWrapper } from '@modules/events/components/create/StepWrapper';
import { EventFormData } from '@modules/events/types/form';
import { Box, Button, Container, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const steps = ['Basic Info', 'Date & Time', 'Location', 'Details & Rules', 'Review'];

const CreateEvent = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<EventFormData>({});
  const [stepsValidation, setStepsValidation] = useState<Record<number, boolean>>({});

  const handleFormChange = (field: keyof EventFormData, value: any) => {
    console.group('CreateEvent: Form Update');

    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
    console.groupEnd();
  };

  const handleNext = () => {
    if (stepsValidation[activeStep]) {
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
      default:
        return 'Unknown step';
    }
  };

  const navigationButtons = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
        {t('Back')}
      </Button>
      <Box sx={{ flex: '1 1 auto' }} />
      <Button onClick={handleNext} disabled={!stepsValidation[activeStep]}>
        {activeStep === steps.length - 1 ? t('Finish') : t('Next')}
      </Button>
    </Box>
  );

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
        {t('Create New Event')}
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
                  {t(label)}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <StepWrapper actions={navigationButtons}>{getStepContent(activeStep)}</StepWrapper>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateEvent;
