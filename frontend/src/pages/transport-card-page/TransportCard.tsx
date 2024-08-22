import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Container, Box } from '@mui/material';
import './transport-card-page.scss';
import TransportCardStepper from '../../components/transport-card/transport-card-stepper';

const TransportCard: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Container id="transport-card-page-container">
      <Box className="transport-card-container">
        <Typography variant="h2" component="h2" className="transport-card-title" gutterBottom>
          {t('TRANSPORT_TITLE')}
        </Typography>
      </Box>
      <TransportCardStepper/>
    </Container>
  );
};

export default TransportCard;
