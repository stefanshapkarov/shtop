import {Box, Typography} from "@mui/material"
import {RouteCardProps} from "./RouteCardProps";
import './route-card.scss'
import Route_Line from '../../styles/icons/route_line_icon.png'
import Anon_Profile from '../../styles/images/anon_profile.jpg'
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import StarIcon from "@mui/icons-material/Star";

export const RouteCard = (props: RouteCardProps) => {

    const navigate = useNavigate();
    const {t} = useTranslation()

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

    return <Box id='route-card-container' onClick={() => navigate(`/route/${props.ride.id}`)}>
        <Box className={props.moreStyles ? 'route-card-wrapper' : 'route-card-wrapper-vanilla'}>
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
                <Box className={!props.moreStyles ? 'price-container' : ''}>
                    <Typography variant='h4' className='text'>{props.ride.price_per_seat}<span
                        className='currency'>ден</span></Typography>
                    {!props.moreStyles && (
                        <Typography
                            variant='h4'>{props.ride.total_seats - props.ride.available_seats} / {props.ride.total_seats}</Typography>
                    )}
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
                    <Typography
                        variant='h4'>{props.ride.total_seats - props.ride.available_seats} / {props.ride.total_seats}</Typography>
                </Box>
            )}
        </Box>
    </Box>
}
