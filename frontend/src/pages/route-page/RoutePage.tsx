import {Box, Button, Divider, Typography} from "@mui/material";
import './route-page.scss'
import {Ride} from "../../models/ride/Ride";
import {useTranslation} from "react-i18next";
import {RouteCard} from "../../shared/components/route-card/RouteCard";
import Anon_Photo from '../../shared/styles/images/anon_profile.jpg'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {format} from "date-fns";
import StarIcon from '@mui/icons-material/Star';
import {useEffect, useState} from "react";
import Chat_Icon from '../../shared/styles/icons/chat_icon.png'
import {fetchRideById, getRideRequests} from "../../services/api";
import {useParams} from "react-router-dom";
import dayjs, {Dayjs} from "dayjs";
import {Loader} from "../../shared/components/loader/Loader";

export const RoutePage = () => {

    const {t} = useTranslation();
    const [isExtended, setIsExtended] = useState<boolean>(false);
    const [ride, setRide] = useState<Ride>();
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (!id)
            return;
        setIsLoading(true);
        const rideTmp = await fetchRideById(id);
        setRide(rideTmp);
        setIsLoading(false);
    }

    const getDateText = (date: Dayjs | undefined) => {
        if (!date) return;
        const dayOfWeek = date.day();
        const dayOfMonth = date.date();

        let result = t(`${dayOfWeek}`) + ', ' + dayOfMonth;

        if ([11, 12, 13].includes(dayOfMonth)) {
            result += t('FOURTH');
        } else if (dayOfMonth % 10 === 1) {
            result += t('FIRST');
        } else if (dayOfMonth % 10 === 2) {
            result += t('SECOND');
        } else if (dayOfMonth % 10 === 3) {
            result += t('THIRD');
        } else {
            result += t('FOURTH');
        }
        result += ' ' + t(`${date.month() * -1 - 1}`) + ' ' + date.year();

        return result
    }

    return <Box id='route-page-wrapper'>
        {ride && !isLoading
            ? <Box className='route-info-container'>
                <Typography variant='h3'
                            className='date'>{getDateText(dayjs(ride.departure_time, 'YYYY-MM-DD HH:mm:ss'))}</Typography>
                <RouteCard moreStyles={false} ride={ride}/>
                <Divider className='divider'/>
                <Box className='drive-info-container' onClick={() => setIsExtended(!isExtended)}>
                    <Typography variant='h5' fontWeight='bold'>{t('DRIVER')}: {ride.driver.name}</Typography>
                    <Box className='driver-picture-container'>
                        <img src={ride.driver.profile_picture ? ride.driver.profile_picture : Anon_Photo}
                             alt='driver-photo'
                             className='profile-picture'/>
                        <KeyboardArrowDownIcon className={isExtended ? 'arrow arrow-extended' : 'arrow'}/>
                    </Box>
                </Box>
                <Box
                    className={isExtended ? 'driver-info-collapsable driver-info-collapsable-opened' : 'driver-info-collapsable'}
                    onClick={() => setIsExtended(!isExtended)}>
                    <Typography fontWeight='bold'>{t('BIO')}:</Typography>
                    <Typography variant='body2' className='bio'>{ride.driver.bio}</Typography>
                    <Box className='driver-info-extended'>
                        <Box>
                            <Typography fontWeight='bold'>{t('MEMBER_SINCE')}:</Typography>
                            <Typography variant='body2'
                                        className='bio'>{format(ride.driver.created_at, "P")}</Typography>
                        </Box>
                        <Box>
                            <Typography fontWeight='bold'>{t('RATING')}:</Typography>
                            <Box className='bio'>
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon key={index}
                                              className={index < Math.round(ride.driver.rating) ? 'star' : 'star star-empty'}/>
                                ))}
                            </Box>
                        </Box>
                        <Box>
                            <Typography fontWeight='bold'>{t('VERIFIED')}:</Typography>
                            <Typography variant='body2'
                                        className='bio'>{ride.driver.is_verified ? t('YES') : t('NO')}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider className='divider'/>
                <Box className='accepted-passengers-container'>
                    <Typography variant='h6'>
                        {t('ACCEPTED_PASSENGERS')}:
                        ( {ride.total_seats - ride.available_seats} / {ride.total_seats} )
                    </Typography>
                    <Box className='users-list'>
                        {Array.from({length: 5}).map(() => (
                            <Box className='user-list-item'>
                                <Box className='pair'>
                                    <img src={ride.driver.profile_picture ? ride.driver.profile_picture : Anon_Photo}
                                         alt='driver-photo'
                                         className='profile-picture'/>
                                    <Typography variant='h6'>{ride.driver.name}</Typography>
                                </Box>
                                <Box className='pair'>
                                    <img className='chat-icon' src={Chat_Icon} alt='chat'/>
                                    <Typography
                                        className='contact-user-text'>{t('CONTACT')} {ride.driver.name}</Typography>
                                </Box>
                                <Button variant='contained' size='small' color='error'
                                        className='button'>{t('REMOVE')}</Button>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Divider className='divider'/>
                <Box className='accepted-passengers-container'>
                    <Typography variant='h6'>
                        {t('PENDING_REQUESTS')}:
                        {/*( {ride.totalSeats - ride.availableSeats} / {ride.totalSeats} )*/}
                    </Typography>
                    <Box className='users-list'>
                        {Array.from({length: 5}).map(() => (
                            <Box className='user-list-item'>
                                <Box className='pair'>
                                    <img src={ride.driver.profile_picture ? ride.driver.profile_picture : Anon_Photo}
                                         alt='driver-photo'
                                         className='profile-picture'/>
                                    <Typography variant='h6'>{ride.driver.name}</Typography>
                                </Box>
                                <Box className='pair'>
                                    <img className='chat-icon' src={Chat_Icon} alt='chat'/>
                                    <Typography
                                        className='contact-user-text'>{t('CONTACT')} {ride.driver.name}</Typography>
                                </Box>
                                <Box>
                                    <Button variant='contained' size='small' color='error'
                                            className='button button-green'>{t('ACCEPT')}</Button>
                                    <Button variant='contained' size='small' color='error'
                                            className='button'>{t('DECLINE')}</Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            : <Box className='loader-container'>
                <Loader/>
            </Box>
        }
    </Box>
}
