import {Box, Divider, Typography} from "@mui/material";
import './route-page.scss'
import {ridesTEST} from "../../models/ridesTEST";
import {Ride} from "../../models/ride/Ride";
import {useTranslation} from "react-i18next";
import {RouteCard} from "../../shared/components/route-card/RouteCard";
import Anon_Photo from '../../shared/styles/images/anon_profile.jpg'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {format} from "date-fns";
import StarIcon from '@mui/icons-material/Star';
import {useState} from "react";

export const RoutePage = () => {

    const {t} = useTranslation()
    const rideTest: Ride = ridesTEST[0];
    const [isExtended, setIsExtended] = useState<boolean>(false);

    const getDateText = (date: Date) => {
        const dayOfMonth = date.getDate();
        let result = t(`${date.getDay()}`) + ', ' + dayOfMonth;
        if (dayOfMonth % 10 === 1) {
            result += t('FIRST');
        } else if (dayOfMonth % 10 === 2) {
            result += t('SECOND');
        } else if (dayOfMonth % 10 === 3) {
            result += t('THIRD');
        } else {
            result += t('FOURTH');
        }
        result += ' ' + t(`${date.getMonth() * -1}`);
        return result
    }

    return <Box id='route-page-wrapper'>
        <Box className='route-info-container'>
            <Typography variant='h3' className='date'>{getDateText(rideTest.departureTime)}</Typography>
            <RouteCard moreStyles={false} ride={rideTest}/>
            <Divider className='divider'/>
            <Box className='drive-info-container' onClick={() => setIsExtended(!isExtended)}>
                <Typography variant='h5' fontWeight='bold'>{t('DRIVER')}: {rideTest.driver.name}</Typography>
                <Box className='driver-picture-container'>
                    <img src={rideTest.driver.profilePicture ? rideTest.driver.profilePicture : Anon_Photo}
                         alt='driver-photo'
                         className='profile-picture'/>
                    <KeyboardArrowDownIcon className={isExtended ? 'arrow arrow-extended' : 'arrow'}/>
                </Box>
            </Box>
            <Box className={isExtended ? 'driver-info-collapsable driver-info-collapsable-opened' : 'driver-info-collapsable' } onClick={() => setIsExtended(!isExtended)}>
                <Typography fontWeight='bold'>{t('BIO')}:</Typography>
                <Typography variant='body2' className='bio'>{rideTest.driver.bio}</Typography>
                <Box className='driver-info-extended'>
                    <Box>
                        <Typography fontWeight='bold'>{t('MEMBER_SINCE')}:</Typography>
                        <Typography variant='body2'
                                    className='bio'>{format(rideTest.driver.createdAt, "P")}</Typography>
                    </Box>
                    <Box>
                    <Typography fontWeight='bold'>{t('RATING')}:</Typography>
                        <Box className='bio'>
                            {[...Array(5)].map((_, index) => (
                                <StarIcon key={index}
                                          className={index < Math.round(rideTest.driver.rating) ? 'star' : 'star star-empty'}/>
                            ))}
                        </Box>
                    </Box>
                    <Box>
                        <Typography fontWeight='bold'>{t('VERIFIED')}:</Typography>
                        <Typography variant='body2' className='bio'>{rideTest.driver.isVerified ? t('YES') : t('NO')}</Typography>
                    </Box>
                </Box>
            </Box>
            <Divider className='divider'/>
        </Box>
    </Box>
}