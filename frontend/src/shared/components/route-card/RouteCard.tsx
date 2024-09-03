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
        if (!loggedUser)
            navigate('/login')
        else if (loggedUser.id === props.ride.driver.id) {
            navigate(`/edit/${props.ride.id}`)
        } else if (props.ride.existing_request_id === null) {
            setIsRequestLoading(true)
            makeRideRequest(props.ride.id)
                .then((response) => {
                    props.updateRides?.(props.ride.id, response.request_id);
                    setIsRequestLoading(false);
                });
        } else {
            setIsRequestLoading(true)
            cancelRideRequest(props.ride.existing_request_id)
                .then(() => {
                    props.updateRides?.(props.ride.id, null);
                    setIsRequestLoading(false);
                })
        }
    }

    const navigateToRide = () => {
        if (!isRequestLoading)
            navigate(`/route/${props.ride.id}`);
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
                                              className={index < Math.round(props.ride.driver.rating) ? 'star' : 'star star-empty'}/>
                                ))}
                            </Box>
                        </Box>
                        <Button variant='contained' size='large' disabled={isRequestLoading}
                                className={!props.ride.existing_request_id ? 'request-ride-button green' : 'request-ride-button red'}
                                onClick={(event) => handleRequestClick(event)}>
                            {isRequestLoading
                                ? <Hourglass colors={['#ffffff', '#ffffff']} height='32'/>
                                : (loggedUser?.id === props.ride.driver.id
                                    ? t('EDIT_RIDE')
                                    : !props.ride.existing_request_id ? t('REQUEST_A_RIDE') : t('CANCEL_REQUEST'))}
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
        : <Box id='loader-box'>
            <Loader/>
        </Box>
}
