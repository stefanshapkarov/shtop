import React from 'react';
import { TextField, MenuItem, Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './step-3.scss';

interface StepProps {
  rideData: {
    departure_time: string;
    departure_city: string;
    destination_city: string;
    total_seats: string;
    price_per_seat: string;
    luggage_space: string;
    notes: string;
  };
  updateRideData: (newData: Partial<StepProps['rideData']>) => void;
}

const TransportCardStepThree: React.FC<StepProps> = ({ rideData, updateRideData }) => {
  const { t } = useTranslation();

  const luggageOptions = [
    { value: 'Рачна торба', label: t('HAND_BAG') },
    { value: 'Мал куфер', label: t('SMALL_SUITCASE') },
    { value: 'Голем куфер', label: t('LARGE_SUITCASE') },
  ];

  const handleInputChange = (field: keyof StepProps['rideData']) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateRideData({ [field]: event.target.value });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start" width="1200px" className="transport-card-step-three">
      <Grid container spacing={2} className="fields-group">
        <Grid item xs={12} md={6}>
          <TextField
            label={t('NO_FREE_SEATS')}
            type="number"
            value={rideData.total_seats}
            onChange={handleInputChange('total_seats')}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label={t('LUGGAGE_SPACE')}
            select
            value={rideData.luggage_space}
            onChange={handleInputChange('luggage_space')}
            fullWidth
            margin="normal"
          >
            {luggageOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label={t('PRICE_PER_SEAT')}
            type="number"
            value={rideData.price_per_seat}
            onChange={handleInputChange('price_per_seat')}
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransportCardStepThree;
