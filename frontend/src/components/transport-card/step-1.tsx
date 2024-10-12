import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Grid } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';
import { useTranslation } from 'react-i18next';
import Geocoder from 'nominatim-geocoder';
import './step-1.scss';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Set default icon for the markers
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const geocoder = new Geocoder();

interface LocationMarkerProps {
    position: LatLng | null;
    setPosition: (position: LatLng) => void;
    setCityAndCoordinates: (coordinates: string, city: string) => void;
    initialCoordinates?: LatLng | null;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, setPosition, setCityAndCoordinates, initialCoordinates }) => {
    useEffect(() => {
        // If initial coordinates are provided, set the marker position and reverse geocode it
        if (initialCoordinates) {
            setPosition(initialCoordinates);
            const coordinates = `${initialCoordinates.lat},${initialCoordinates.lng}`;

            geocoder.reverse({ lat: initialCoordinates.lat, lon: initialCoordinates.lng })
                .then((response: any) => {
                    const city = response.address.city || response.address.town || response.address.village || 'Unknown location';
                    setCityAndCoordinates(coordinates, city);
                });
        }

    }, []);

    useMapEvents({
        click(e: L.LeafletMouseEvent) {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng); 
            const coordinates = `${lat},${lng}`;

            geocoder.reverse({ lat, lon: lng })
                .then((response: any) => {
                    const city = response.address.city || response.address.town || response.address.village || 'Unknown location';
                    setCityAndCoordinates(coordinates, city);
                })
                .catch((error: any) => {
                    console.error('Geocoding error:', error);
                });
        }
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

interface TransportCardStepOneProps {
    rideData: {
        departure_time: Date;
        departure_coords: string;
        destination_coords: string;
        departure_city: string;
        destination_city: string;
        duration: string;  
    };
    updateRideData: (newData: Partial<TransportCardStepOneProps['rideData']>) => void;
    departurePosition: LatLng | null;
    destinationPosition: LatLng | null;
    setDeparturePosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
    setDestinationPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
    isEditing?: boolean;
}

const TransportCardStepOne: React.FC<TransportCardStepOneProps> = ({
    rideData,
    updateRideData,
    departurePosition,
    destinationPosition,
    setDeparturePosition,
    setDestinationPosition,
    isEditing
}) => {
    const { t } = useTranslation();
    const [travelTime, setTravelTime] = useState<string>(''); 

    const formatTravelTime = (duration: number): string => {
        if (duration < 60) {
            return `${duration} min`;
        } else {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return `${hours}h ${minutes}min`;
        }
    };

    const convertToDatabaseTime = (duration: number): string => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
    
        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    
        return `${formattedHours}:${formattedMinutes}`; 
    };
    

    const fetchTravelTime = async (departurePosition: LatLng | null, destinationPosition: LatLng | null) => {
        if (departurePosition && destinationPosition) {
            const startCoords = `${departurePosition.lng},${departurePosition.lat}`;
            const endCoords = `${destinationPosition.lng},${destinationPosition.lat}`;
            
            try {
                const response = await fetch(`http://router.project-osrm.org/route/v1/driving/${startCoords};${endCoords}?overview=false`);
                const data = await response.json();
                if (data.routes && data.routes.length > 0) {
                    const durationInSeconds = data.routes[0].duration; 
                    const travelTimeFormatted = formatTravelTime(Math.floor(durationInSeconds / 60)); 
                    const travelTimeForDB = convertToDatabaseTime(durationInSeconds); 
                    
                    setTravelTime(travelTimeFormatted); 
                    updateRideData({ duration: travelTimeForDB }); 
                }
            } catch (error) {
                console.error('Error fetching travel time:', error);
            }
        }
    };

    useEffect(() => {
        fetchTravelTime(departurePosition, destinationPosition); 
    }, [departurePosition, destinationPosition]);

    const handleLocationChange = (field: 'departure_coords' | 'destination_coords', cityField: 'departure_city' | 'destination_city') => (coordinates: string, city: string) => {
        updateRideData({ [field]: coordinates, [cityField]: city });
    };

    const formatDateForInput = (date: Date): string => {
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 16); 
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = event.target.value;
        updateRideData({...rideData, departure_time: new Date(newDate) });
    };


    return (
        <Box display="flex" flexDirection="column" alignItems="center" className="transport-card-step-one">
            <Box display="flex" justifyContent="space-between" width="1200px" mb={2} className="maps-container">
                <Box className="map-box">
                    <Typography className="map-title">{t('START_LOCATION')}</Typography>
                    <MapContainer center={departurePosition ?? [41.9996479336892, 21.438695249988935]} zoom={13} className="map-container">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                            position={departurePosition}
                            setPosition={setDeparturePosition}
                            setCityAndCoordinates={handleLocationChange('departure_coords', 'departure_city')}
                            initialCoordinates={isEditing ? departurePosition : null}
                        />
                    </MapContainer>
                </Box>
                <Box className="map-box">
                    <Typography className="map-title">{t('END_LOCATION')}</Typography>
                    <MapContainer center={destinationPosition ?? [41.9996479336892, 21.438695249988935]} zoom={13} className="map-container">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        <LocationMarker
                            position={destinationPosition}
                            setPosition={setDestinationPosition}
                            setCityAndCoordinates={handleLocationChange('destination_coords', 'destination_city')}
                            initialCoordinates={isEditing ? destinationPosition : null}
                        />
                    </MapContainer>
                </Box>
            </Box>

            <Grid container className="grids" spacing={2} width="97%" mb={2}>
                <Grid item xs={6}>
                    <Typography component="div">
                        <strong>{t('DEPARTURE_FROM')}:</strong> {rideData.departure_city || ''}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography component="div" paddingLeft={2}>
                        <strong>{t('ARRIVAL_TO')}:</strong> {rideData.destination_city || ''}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container className="grids" spacing={2} width="98%" mb={2}>
                <Grid item xs={6}>
                    <TextField
                        label={t('ADD_DEPT_DATE')}
                        type="datetime-local"
                        fullWidth
                        value={formatDateForInput(rideData.departure_time)}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                </Grid>
            </Grid>

            {/* Display the estimated travel time */}
            <Grid container className="grids" spacing={2} width="98%" mb={2}>
                <Grid item xs={12}>
                    <Typography component="div">
                        <strong>{t('ESTIMATED_TRAVEL_TIME')}:</strong> {travelTime || ''}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TransportCardStepOne;
