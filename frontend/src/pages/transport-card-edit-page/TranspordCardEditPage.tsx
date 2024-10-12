import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TransportCardStepOne from '../../components/transport-card/step-1';
import { fetchRideById, updateRide } from '../../services/api';  
import { useAuth } from '../../context/AuthContext';
import { Ride } from '../../models/ride/Ride';  
import Geocoder from 'nominatim-geocoder';
import './TranspordCardEditPage.scss';
import L, { LatLng } from 'leaflet';

const geocoder = new Geocoder();

const TransportCardEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();  
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, loading } = useAuth() as { user: any, loading: boolean };

    const [rideData, setRideData] = useState<Ride>({
        id: 0,
        driver: {
            id: 0,
            admin: 0,
            name: "",
            email: "",
            profile_picture: null,
            bio: null,
            location: null,
            created_at: new Date(),
            updated_at: new Date(),
            is_verified: false,
            rating: 0
        },
        departure_time: new Date(),
        total_seats: 0,
        available_seats: 0,
        price_per_seat: 0,
        departure_coords: '',
        departure_city: '',
        destination_coords: '',
        destination_city: '',
        vehicle: '',
        duration: '',  
        created_at: new Date(),
        existing_request_id: null
    });
    

    const [departureCityName, setDepartureCityName] = useState<string>('Fetching city...');
    const [destinationCityName, setDestinationCityName] = useState<string>('Fetching city...');
    const [departurePosition, setDeparturePosition] = useState<L.LatLng | null>(null);
    const [destinationPosition, setDestinationPosition] = useState<L.LatLng | null>(null);
    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);  

    const reverseGeocode = async (coordinates: string) => {
        const [lat, lon] = coordinates.split(',').map(Number);
        try {
            const response = await geocoder.reverse({ lat, lon });
            if (response && response.display_name) {
                const addressParts = response.display_name.split(',');
                const cityName = addressParts.find(part => part.includes("City") || part.includes("Village") || part.includes("Town"));
                return cityName ? cityName.trim() : 'Unknown city';
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        return 'Unknown city';
    };

    useEffect(() => {
        async function fetchRideDetails() {
            if (!id) {
                console.error('rideId is undefined');
                return;
            }

            setIsLoading(true);
            try {
                const ride = await fetchRideById(id);  
                setRideData({
                    ...ride,
                    departure_time: new Date(ride.departure_time),
                });

                const [departureLat, departureLon] = ride.departure_coords.split(',').map(Number);
                const [destinationLat, destinationLon] = ride.destination_coords.split(',').map(Number);
                setDeparturePosition(new L.LatLng(departureLat, departureLon));
                setDestinationPosition(new L.LatLng(destinationLat, destinationLon));

                setDepartureCityName(ride.departure_city);
                setDestinationCityName(ride.destination_city);
                
            } catch (error) {
                console.error('Error fetching ride details:', error);
            } finally {
                setIsLoading(false);  
            }
        }
        fetchRideDetails();
    }, []);

    const updateRideData = (newData: Partial<Ride>) => {
        setRideData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    const handleUpdateRide = async () => {
        try {
            await updateRide(id!, rideData);  
            setIsSubmittedSuccessfully(true);
            navigate('/search-route');
        } catch (error) {
            console.error('Error updating ride:', error);
            setIsSubmittedSuccessfully(false);
        }
    };

    if (isLoading) return <div>{t('Loading...')}</div>;  

    return (
        <Box className="edit-page-container">
            <Typography variant="h4" align="center" gutterBottom>{t('EDIT_RIDE')}</Typography>

            <Box className="step-content">
                <TransportCardStepOne 
                    rideData={rideData} 
                    updateRideData={updateRideData}
                    departurePosition={departurePosition} 
                    destinationPosition={destinationPosition} 
                    setDeparturePosition={setDeparturePosition}
                    setDestinationPosition={setDestinationPosition}
                    isEditing={true}
                />

                <Box mt={3} className="additional-fields">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label={t('NO_FREE_SEATS')}
                                fullWidth
                                type="number"
                                value={rideData.total_seats}
                                onChange={(e) => updateRideData({ total_seats: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label={t('PRICE_PER_SEAT')}
                                fullWidth
                                type="number"
                                value={rideData.price_per_seat}
                                onChange={(e) => updateRideData({ price_per_seat: parseInt(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label={t('VEHICLE')}
                                fullWidth
                                value={rideData.vehicle}
                                onChange={(e) => updateRideData({ vehicle: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Box className="button-container">
    <Button variant="contained" color="primary" className="button--primary" onClick={handleUpdateRide}>
        {t('UPDATE')}
    </Button>
</Box>


            {isSubmittedSuccessfully === false && (
                <Typography color="error">{t('Error updating ride')}</Typography>
            )}
            {isSubmittedSuccessfully === true && (
                <Typography color="success">{t('Ride updated successfully!')}</Typography>
            )}
        </Box>
    );
};

export default TransportCardEditPage;
