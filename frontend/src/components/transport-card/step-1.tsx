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
    setCityAndCoordinates: (city: string, coordinates: string) => void;
    initialCoordinates?: LatLng | null;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, setPosition, setCityAndCoordinates, initialCoordinates }) => {
    useEffect(() => {
        // If initial coordinates are provided, set the marker position and reverse geocode it
        if (initialCoordinates) {
            setPosition(initialCoordinates);
            geocoder.reverse({ lat: initialCoordinates.lat, lon: initialCoordinates.lng })
                .then((response: any) => {
                    const city = response.address.city || 'Unknown location';
                    const coordinates = `${initialCoordinates.lat},${initialCoordinates.lng}`;
                    setCityAndCoordinates(city, coordinates);
                })
                .catch((error: any) => {
                    console.error('Geocoding error:', error);
                });
        }
    }, [initialCoordinates, setPosition, setCityAndCoordinates]);

    useMapEvents({
        click(e: L.LeafletMouseEvent) {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng); // Update marker position
            const coordinates = `${lat},${lng}`;

            geocoder.reverse({ lat, lon: lng })
                .then((response: any) => {
                    const city = response.address.city || 'Unknown location';
                    setCityAndCoordinates(city, coordinates);
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
        departure_city: string;
        destination_city: string;
    };
    updateRideData: (newData: Partial<TransportCardStepOneProps['rideData']>) => void;
    departurePosition: LatLng | null;
    destinationPosition: LatLng | null;
    setDeparturePosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
    setDestinationPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
    isEditing?: boolean;  // Indicates if editing mode is active
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
    const [departureCityDisplay, setDepartureCityDisplay] = useState<string>(''); 
    const [destinationCityDisplay, setDestinationCityDisplay] = useState<string>(''); 

    useEffect(() => {
        // If editing mode is active and coordinates are provided, reverse geocode the locations to get city names
        if (isEditing && departurePosition) {
            geocoder.reverse({ lat: departurePosition.lat, lon: departurePosition.lng })
                .then((response: any) => {
                    setDepartureCityDisplay(response.address.city || 'Unknown location');
                })
                .catch((error: any) => console.error(error));
        }
        if (isEditing && destinationPosition) {
            geocoder.reverse({ lat: destinationPosition.lat, lon: destinationPosition.lng })
                .then((response: any) => {
                    setDestinationCityDisplay(response.address.city || 'Unknown location');
                })
                .catch((error: any) => console.error(error));
        }
    }, [isEditing, departurePosition, destinationPosition]);

    // Handles location and city name updates when a location is selected on the map
    const handleLocationChange = (field: 'departure_city' | 'destination_city', displaySetter: React.Dispatch<React.SetStateAction<string>>) => (city: string, coordinates: string) => {
        updateRideData({ [field]: coordinates });  // Update the ride data with the coordinates
        displaySetter(city); // Update the displayed city name
    };

    // Formats the date input to be compatible with the datetime-local input field
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
                            setCityAndCoordinates={handleLocationChange('departure_city', setDepartureCityDisplay)}
                            initialCoordinates={isEditing ? departurePosition : null}  // Set initial marker position if editing
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
                            setCityAndCoordinates={handleLocationChange('destination_city', setDestinationCityDisplay)}
                            initialCoordinates={isEditing ? destinationPosition : null}  // Set initial marker position if editing
                        />
                    </MapContainer>
                </Box>
            </Box>

            <Grid container className="grids" spacing={2} width="97%" mb={2}>
                <Grid item xs={6}>
                    <Typography component="div">
                        <strong>{t('DEPARTURE_FROM')}:</strong> {departureCityDisplay}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography component="div" paddingLeft={2}>
                        <strong>{t('ARRIVAL_TO')}:</strong> {destinationCityDisplay}
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
        </Box>
    );
};

export default TransportCardStepOne;
