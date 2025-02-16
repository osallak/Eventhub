import { Box, Container, Paper, Stepper, Step, StepLabel, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicInfoStep } from '@modules/events/components/create/BasicInfoStep';
import { DateTimeStep } from '@modules/events/components/create/DateTimeStep';
import { LocationStep } from '@modules/events/components/create/LocationStep';
import { DetailsStep } from '@modules/events/components/create/DetailsStep';
import { EventFormData } from '@modules/events/types/form';
import { StepWrapper } from '@modules/events/components/create/StepWrapper';

// Step components will be created separately
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
        return (
          <BasicInfoStep {...commonProps} />
        );
      case 1:
        return (
          <DateTimeStep {...commonProps} />
        );
      case 2:
        return (
          <LocationStep {...commonProps} />
        );
      case 3:
        return (
          <DetailsStep {...commonProps} />
        );
      default:
        return 'Unknown step';
    }
  };

  const navigationButtons = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        color="inherit"
        disabled={activeStep === 0}
        onClick={handleBack}
        sx={{ mr: 1 }}
      >
        {t('Back')}
      </Button>
      <Box sx={{ flex: '1 1 auto' }} />
      <Button
        onClick={handleNext}
        disabled={!stepsValidation[activeStep]}
      >
        {activeStep === steps.length - 1 ? t('Finish') : t('Next')}
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%', mt: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{t(label)}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <StepWrapper actions={navigationButtons}>
          {getStepContent(activeStep)}
        </StepWrapper>
      </Box>
    </Container>
  );
};

export default CreateEvent;
