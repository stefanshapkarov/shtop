import * as React from 'react';
import { useState } from 'react';
import { Stepper, Step, StepLabel, Typography, Box, styled, Divider } from '@mui/material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import './transport-card-stepper.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TransportCardStepOne from '../../components/transport-card/step-1';
import TransportCardStepThree from './step-3';
import { postRide } from '../../services/api';

interface RideData {
  departure_time: Date;
  total_seats: number;
  price_per_seat: number;
  departure_city: string;
  vehicle: string;
  destination_city: string;
}

interface StepProps {
  rideData: RideData;
  updateRideData: (newData: Partial<RideData>) => void;
}

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 25,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '20px',
    marginRight: '20px',
  },
}));

const CustomStepIcon = (props: StepIconProps) => {
  const { active, completed } = props;
  const color = active || completed ? '#26a69a' : '#eaeaf0';

  return (
    <div
      style={{
        backgroundColor: color,
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        width: 50,
        height: 50,
        marginLeft: '20px',
        marginRight: '20px',
      }}
    ></div>
  );
};

function getStepContent(step: number, props: StepProps) {
  switch (step) {
    case 0:
      return <TransportCardStepOne {...props} />;
    case 1:
      return <TransportCardStepThree {...props} />;
    default:
      return "Unknown Step";
  }
}

const TransportCardStepper: React.FC = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const [rideData, setRideData] = useState<RideData>({
    departure_time: new Date(),
    total_seats: 0,
    price_per_seat: 0,
    departure_city: '',
    vehicle: '',
    destination_city: '',
  });

  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState<boolean | null>(null);

  const updateRideData = (newData: Partial<RideData>) => {
    setRideData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const handleSubmit = async () => {
    console.log('Submitting the following data:', rideData);

    try {
      const response = await postRide(rideData);
      console.log('Ride post created successfully:', response);
      setIsSubmittedSuccessfully(true); // Set success state to true
      navigate('/search-route'); // Redirect to search-route
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmittedSuccessfully(false); // Set success state to false if there was an error
    }
  };

  const steps = [
    <Typography variant="body1">{t('STEP_1')}</Typography>,
    <Typography variant="body1">{t('STEP_2')}</Typography>,
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleReset = () => setActiveStep(0);

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<CustomConnector />}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
          <Typography variant="h6">
            {isSubmittedSuccessfully ? 'Ride post created successfully!' : 'There was an error creating the ride post. Please try again.'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, pb: 2 }}>
          <Typography>{getStepContent(activeStep, { rideData, updateRideData })}</Typography>

          <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
            <button className="button button--secondary" onClick={handleBack}>
              {t('BACK')}
            </button>
            <button className="button button--primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? t('POST') : t('NEXT')}
            </button>
          </Box>
          <Divider sx={{ borderBottomWidth: 2 }}></Divider>
        </Box>
      )}
    </Box>
  );
};

export default TransportCardStepper;