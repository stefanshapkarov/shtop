import {Box, Button, Typography} from "@mui/material"
import {RouteCardProps} from "./RouteCardProps";
import './route-card.scss'
import Route_Line from '../../styles/icons/route_line_icon.png'
import Anon_Profile from '../../styles/images/anon_profile.jpg'
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import StarIcon from "@mui/icons-material/Star";
import {useEffect, useState} from "react";
import {UserType} from "../../../models/user-type/UserType";
import {cancelRideRequest, getCurrentUser, makeRideRequest} from "../../../services/api";
import {Hourglass} from "react-loader-spinner";
import {Loader} from "../loader/Loader";
import {RideStatus} from "../../../models/ride-status/RideStatus";

export const RouteCard = (props: RouteCardProps) => {

    const navigate = useNavigate();
    const {t} = useTranslation()
    const [loggedUser, setLoggedUser] = useState<UserType | undefined>(undefined);
    const [isRequestLoading, setIsRequestLoading] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (props.moreStyles)
            setIsLoaded(false)
        getCurrentUser().then((response) => {
            setLoggedUser(response);
            setIsLoaded(true)
        });
    }, []);

    const getDateText = (date: Date | undefined) => {
        if (!date) return;
        const month = parseInt(date.toString().slice(5, 7))
        const day = parseInt(date.toString().slice(8, 10))
        let result = day.toString();

        if ([11, 12, 13].includes(day)) {
            result += t('FOURTH');
        } else if (day % 10 === 1) {
            result += t('FIRST');
        } else if (day % 10 === 2) {
            result += t('SECOND');
        } else if (day % 10 === 3) {
            result += t('THIRD');
        } else {
            result += t('FOURTH');
        }
        result += ' ' + t(`${month * -1}`).slice(0, 3);

        return result
    }

    const handleRequestClick = (event: any) => {
        event.stopPropagation();

    
        // Check if the user is logged in
        if (!loggedUser) {
            navigate('/login');
        } 

        // Check if the logged-in user is the driver
        else if (loggedUser.id === props.ride.driver.id) {
            if (props.ride.status === RideStatus.pending.toString()) {
                navigate(`/edit/${props.ride.id}`);
            } else {
                navigate('rate');
            }
        } 
        // If the user is not the driver, check if a ride request has been made
        else if (props.ride.existing_request_id === null) {
            if (props.ride.status === 'completed') {
                alert('This ride has already been completed.');
                return; // Exit the function early if the ride is completed
            }
            else{
                setIsRequestLoading(true);
                makeRideRequest(props.ride.id)
                    .then((response) => {
                        props.updateRides?.(props.ride.id, response.request_id);
                        setIsRequestLoading(false);
                    })
                    .catch((e) => alert(e.message));
                    
            }
        }
        
        // If a request has already been made, allow the user to cancel it or rate the ride
        else {
            setIsRequestLoading(true);
            if (props.ride.status === RideStatus.pending.toString()) {
                cancelRideRequest(props.ride.existing_request_id)
                    .then(() => {
                        props.updateRides?.(props.ride.id, null);
                        setIsRequestLoading(false);
                    });
            } else {
                navigate('rate');
            }
        }
    };

    const navigateToRide = () => {
        if (!isRequestLoading)
            navigate(`/route/${props.ride.id}`);
    }

    function formatDuration(duration: string): string {
        // Split the duration into hours, minutes, and seconds
        const [hours, minutes] = duration.split(':').map(Number);
    
        // Construct the human-readable format
        if (hours > 0 && minutes > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return '0 minutes';
        }
    }
    

    return isLoaded || !props.moreStyles
        ? <Box id='route-card-container' onClick={() => navigateToRide()}>
            <Box
                className={props.moreStyles ? (!isRequestLoading ? 'route-card-wrapper pointer' : 'route-card-wrapper') : 'route-card-wrapper-vanilla'}>
                <Box className='route-card-content'>
                    <Box className='time-container'>
                        {props.moreStyles &&
                            <Box className='date-container'>
                                <Typography variant='h5'
                                            className='text time'>{format(props.ride.departure_time, 'HH:mm')}</Typography>
                                <Typography variant='h5'
                                            className='text time'>{getDateText(props.ride.departure_time)}</Typography>
                            </Box>
                        }
                        <img src={Route_Line} alt='line'/>
                        <Box className='info-container'>
                            <Typography variant='h5' className='text'>{props.ride.departure_city}</Typography>
                            <Typography 
                                    variant='body1' // Smaller font size variant in Material-UI
                                    className='duration-text' // Use a CSS class for styling
                                >
                                     {/* {props.ride.duration.slice(0, 5)} */}
                                     {formatDuration(props.ride.duration)}

                                </Typography>
                            <Typography variant='h5' className='text'>{props.ride.destination_city}</Typography>
                        </Box>
                    </Box>
                    <Box className='price-container'>
                        <Typography variant='h4' className='text'>{props.ride.price_per_seat}<span
                            className='currency'>ден</span></Typography>
                        <Typography
                            variant='h4'>{props.ride.total_seats - props.ride.available_seats} / {props.ride.total_seats}</Typography>
                    </Box>
                </Box>
                {props.moreStyles && (
                    <Box className='route-card-content second'>
                        <Box className='user-container'>
                            <img className='profile-picture'
                                 src={props.ride.driver.profile_picture ? props.ride.driver.profile_picture : Anon_Profile}
                                 alt='profile-picture'/>
                            <Box>
                                <Typography variant='h4'>{props.ride.driver.name}</Typography>
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon key={index}
                                              className={index < Math.round(props.ride.driver.rating_as_driver) ? 'star' : 'star star-empty'}/>
                                ))}
                            </Box>
                        </Box>
                        <Button variant='contained' size='large' disabled={isRequestLoading}
                                className={!props.ride.existing_request_id ||
                                            props.ride.status.toString() === RideStatus[RideStatus.completed]
                                                ? 'request-ride-button green'
                                                : 'request-ride-button red'}
                                onClick={(event) => handleRequestClick(event)}>
                            {isRequestLoading
                                ? <Hourglass colors={['#ffffff', '#ffffff']} height='32'/>
                                : (loggedUser?.id === props.ride.driver.id
                                    ? props.ride.status === 'pending' ? t('EDIT_RIDE') : t('RATE_PASSENGERS')
                                    : !props.ride.existing_request_id ? t('REQUEST_A_RIDE')
                                        : props.ride.status.toString() === RideStatus[RideStatus.pending] ? t('CANCEL_REQUEST') : t('RATE_DRIVER'))}
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
        : <Box id='loader-box'>
            <Loader/>
        </Box>
}
