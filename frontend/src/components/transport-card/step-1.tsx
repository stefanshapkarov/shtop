import React from 'react';
import { TextField, Typography, Box, Grid } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';
import { useTranslation } from 'react-i18next';
import Geocoder from 'nominatim-geocoder';
import './step-1.scss';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const geocoder = new Geocoder();

interface LocationMarkerProps {
    position: LatLng | null;
    setPosition: (position: LatLng) => void;
    setCity: (city: string) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, setPosition, setCity }) => {
    useMapEvents({
        click(e: L.LeafletMouseEvent) {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng);

            geocoder.reverse({ lat, lon: lng })
                .then((response: any) => {
                    const address = response.display_name;
                    setCity(address);
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
}



const combineDateAndTime = (date: string, time: string): string => {
    return `${date} ${time}:00`; // Keep seconds as "00" in the backend data
};

const TransportCardStepOne: React.FC<TransportCardStepOneProps> = ({ rideData, updateRideData }) => {
    const { t } = useTranslation();
    const [startLocation, setStartLocation] = React.useState<LatLng | null>(null);
    const [endLocation, setEndLocation] = React.useState<LatLng | null>(null);

    const handleLocationChange = (field: 'departure_city' | 'destination_city') => (city: string) => {
        updateRideData({ [field]: city });
    };

    const formatDateForInput = (date: Date): string => {
        // Adjust the date to local time
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = event.target.value;
        updateRideData({ departure_time: new Date(newDate) });
    };
    return (
        <Box display="flex" flexDirection="column" alignItems="center" className="transport-card-step-one">
            <Box display="flex" justifyContent="space-between" width="1200px" mb={2} className="maps-container">
                <Box className="map-box">
                    <Typography className="map-title">{t('START_LOCATION')}</Typography>
                    <MapContainer center={[41.9996479336892, 21.438695249988935]} zoom={13} className="map-container">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                            position={startLocation}
                            setPosition={setStartLocation}
                            setCity={handleLocationChange('departure_city')}
                        />
                    </MapContainer>
                </Box>
                <Box className="map-box">
                    <Typography className="map-title">{t('END_LOCATION')}</Typography>
                    <MapContainer center={[41.9996479336892, 21.438695249988935]} zoom={13} className="map-container">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                            position={endLocation}
                            setPosition={setEndLocation}
                            setCity={handleLocationChange('destination_city')}
                        />
                    </MapContainer>
                </Box>
            </Box>

            <Grid container className="grids" spacing={2} width="97%" mb={2}>
                <Grid item xs={6}>
                    <Typography component="div">
                        <strong>{t('DEPARTURE_FROM')}:</strong> {rideData.departure_city}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography component="div" paddingLeft={2}>
                        <strong>{t('ARRIVAL_TO')}:</strong> {rideData.destination_city}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container className="grids" spacing={2} width="98%" mb={2}>
                <Grid item xs={6}>
                    <TextField
                        label={t('ADD_DEPT_DATE')}
                        type="datetime-local"
                        fullWidth
                        value={formatDateForInput(rideData.departure_time)} // Format the date correctly for input
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
