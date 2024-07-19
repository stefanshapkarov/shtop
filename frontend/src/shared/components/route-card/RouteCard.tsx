import {Box, Typography} from "@mui/material"
import {RouteCardProps} from "./RouteCardProps";
import './route-card.scss'
import Route_Line from '../../styles/icons/route_line_icon.png'
import Anon_Profile from '../../styles/images/anon_profile.jpg'

export const RouteCard = (props: RouteCardProps) => {

    return <Box id='route-card-container'>
        <Box className='route-card-wrapper'>
        <Box className='route-card-content'>
            <Box className='time-container'>
                <Box className='info-container'>
                    <Typography variant='h5' className='text'>{props.departureTime}</Typography>
                    <Typography variant='h5' className='text time-text-grey'>{props.estimatedTimeOfTravel}</Typography>
                    <Typography variant='h5' className='text'>{props.estimatedTimeOfArrival}</Typography>
                </Box>
                <img src={Route_Line} alt='line'/>
                <Box className='info-container'>
                    <Typography variant='h5' className='text'>{props.departureCity}</Typography>
                    <Typography variant='h5' className='text'>{props.destinationCity}</Typography>
                </Box>
            </Box>
            <Box>
                <Typography variant='h4' className='text'>{props.price}<span className='currency'>ден</span></Typography>
            </Box>
        </Box>
        <Box className='route-card-content second'>
            <Box className='user-container'>
                <img className='profile-picture' src={props.profilePicture ? props.profilePicture : Anon_Profile} alt='profile-picture'/>
                <Typography variant='h4'>{props.name}</Typography>
            </Box>
            <Typography variant='h4'>{props.availableSeats} / {props.totalSeats}</Typography>
        </Box>
        </Box>
    </Box>
}