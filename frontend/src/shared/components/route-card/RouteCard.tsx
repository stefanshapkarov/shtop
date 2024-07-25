import {Box, Typography} from "@mui/material"
import {RouteCardProps} from "./RouteCardProps";
import './route-card.scss'
import Route_Line from '../../styles/icons/route_line_icon.png'
import Anon_Profile from '../../styles/images/anon_profile.jpg'
import {format} from "date-fns";

export const RouteCard = (props: RouteCardProps) => {

    const getETT = () => {
        let differenceMs: number = Math.abs(props.ride.estimatedTimeOfArrival.getTime() - props.ride.departureTime.getTime());
        let differenceHours: number = Math.floor(differenceMs / (1000 * 60 * 60));
        let differenceMinutes: number = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));

        let result = '';

        if (differenceHours / 10 < 1)
            result += '0' + differenceHours.toString();
        else
            result += differenceHours.toString();

        result += ':'

        if (differenceMinutes / 10 < 1)
            result += '0' + differenceMinutes.toString();
        else
            result += differenceMinutes.toString();

        return result;
    }

    return <Box id='route-card-container'>
        <Box className={props.moreStyles ? 'route-card-wrapper' : 'route-card-wrapper-vanilla'}>
            <Box className='route-card-content'>
                <Box className='time-container'>
                    <Box className='info-container'>
                        <Typography variant='h5'
                                    className='text'>{format(props.ride.departureTime, 'HH:mm')}</Typography>
                        <Typography variant='h5' className='text time-text-grey'>{getETT()}</Typography>
                        <Typography variant='h5'
                                    className='text'>{format(props.ride.estimatedTimeOfArrival, 'HH:mm')}</Typography>
                    </Box>
                    <img src={Route_Line} alt='line'/>
                    <Box className='info-container'>
                        <Typography variant='h5' className='text'>{props.ride.departureCity}</Typography>
                        <Typography variant='h5' className='text'>{props.ride.destinationCity}</Typography>
                    </Box>
                </Box>
                <Box className={!props.moreStyles ? 'price-container' : ''}>
                    <Typography variant='h4' className='text'>{props.ride.pricePerSeat}<span
                        className='currency'>ден</span></Typography>
                    {!props.moreStyles && (
                        <Typography variant='h4'>{props.ride.availableSeats} / {props.ride.totalSeats}</Typography>
                    )}
                </Box>
            </Box>
            {props.moreStyles && (
                <Box className='route-card-content second'>
                    <Box className='user-container'>
                        <img className='profile-picture'
                             src={props.ride.driver.profilePicture ? props.ride.driver.profilePicture : Anon_Profile}
                             alt='profile-picture'/>
                        <Typography variant='h4'>{props.ride.driver.name}</Typography>
                    </Box>
                    <Typography variant='h4'>{props.ride.availableSeats} / {props.ride.totalSeats}</Typography>
                </Box>
            )}
        </Box>
    </Box>
}