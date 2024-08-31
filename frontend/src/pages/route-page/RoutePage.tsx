import {Alert, Box, Button, Divider, Typography} from "@mui/material";
import './route-page.scss'
import {Ride} from "../../models/ride/Ride";
import {useTranslation} from "react-i18next";
import {RouteCard} from "../../shared/components/route-card/RouteCard";
import Anon_Photo from '../../shared/styles/images/anon_profile.jpg'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {format} from "date-fns";
import StarIcon from '@mui/icons-material/Star';
import {useEffect, useRef, useState} from "react";
import Chat_Icon from '../../shared/styles/icons/chat_icon.png'
import {
    acceptRideRequest,
    cancelRideRequest,
    fetchRideById, getCurrentUser,
    getRideRequests, makeRideRequest,
    rejectRideRequest
} from "../../services/api";
import {useNavigate, useParams} from "react-router-dom";
import dayjs, {Dayjs} from "dayjs";
import {Loader} from "../../shared/components/loader/Loader";
import {RideRequest} from "../../models/ride-request/RideRequest";
import {ConfirmDialog} from "../../shared/components/confirm-dialog/ConfirmDialog";
import {UserType} from "../../models/user-type/UserType";
import {SelectedPassengerOption} from "../../models/selected-passenger/SelectedPassengerOption";
import {Hourglass} from "react-loader-spinner";
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const RoutePage = () => {

    const {t} = useTranslation();
    const [isExtended, setIsExtended] = useState<boolean>(false);
    const [ride, setRide] = useState<Ride>();
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDriver, setIsDriver] = useState<boolean>(false);
    const [acceptedRequests, setAcceptedRequests] = useState<RideRequest[]>([])
    const [pendingRequests, setPendingRequests] = useState<RideRequest[]>([])
    const [selectedRequest, setSelectedRequest] = useState<any>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [loggedUser, setLoggedUser] = useState<UserType | undefined>(undefined);
    const navigate = useNavigate();
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const alertRef = useRef<any>(null);

    useEffect(() => {
        getCurrentUser().then((response) => {
            setLoggedUser(response);
            fetchData(response?.id);
        });
    }, []);

    const fetchData = async (loggedUserId: number | undefined | null) => {
        if (id === null || id === undefined)
            return;
        setIsLoading(true);
        const rideTmp = await fetchRideById(id);
        setRide(rideTmp);
        if (loggedUserId === rideTmp?.driver.id) {
            setIsDriver(true)
            const requestsTmp: RideRequest[] = await getRideRequests(rideTmp.id.toString())
            setAcceptedRequests(requestsTmp.filter((request) => request.status === 'accepted'));
            setPendingRequests(requestsTmp.filter((request) => request.status === 'pending'));
        }
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

    const handleDialogClose = () => {
        setSelectedRequest(undefined);
        setIsDialogOpen(false);
    }

    const handleDialogConfirm = () => {
        if (selectedRequest.action === SelectedPassengerOption.REJECT) {
            rejectRideRequest(selectedRequest.id)
            setPendingRequests(prevRequests => prevRequests.filter(request => request.id !== selectedRequest.id));
        } else if (selectedRequest.action === SelectedPassengerOption.REMOVE) {
            cancelRideRequest(selectedRequest.id)
            setAcceptedRequests(prevRequests => prevRequests.filter(request => request.id !== selectedRequest.id))
        }
        handleDialogClose();
    }

    const handleAcceptRequest = (request: any) => {
        acceptRideRequest(request.id).then(() => setAcceptedRequests(prevRequests => [...prevRequests, request]));
    }

    const getDialogText = (): string => {
        if (!selectedRequest)
            return '';
        if (selectedRequest.action === SelectedPassengerOption.REJECT)
            return `${t('REJECT_DIALOG')}`;
        return `${t('REMOVE_DIALOG')}`;
    }

    const getTitleText = (): string => {
        if (!selectedRequest)
            return '';
        if (selectedRequest.action === SelectedPassengerOption.REJECT)
            return `${t('DECLINE')} ${t('PASSENGER')}: ${selectedRequest.passenger.name}?`;
        return `${t('REMOVE')} ${t('PASSENGER')}: ${selectedRequest.passenger.name}?`;
    }

    const handleRemoveClick = (request: any) => {
        setSelectedRequest({
            ...request,
            action: SelectedPassengerOption.REMOVE
        })
        setIsDialogOpen(true);
    }

    const handleRejectClick = (request: any) => {
        setSelectedRequest({
            ...request,
            action: SelectedPassengerOption.REJECT
        })
        setIsDialogOpen(true)
    }

    const handleRequestClick = () => {
        if (!loggedUser)
            navigate('/login')
        else if (ride && ride.existing_request_id !== null) {
            setIsWaiting(true)
            makeRideRequest(ride.id).then(() => {
                fireAlert();
                setTimeout(() => {
                    setRide(prevState => (prevState && {
                        ...prevState,
                        canRequest: false
                    }));
                    setIsWaiting(false);
                }, 2300);
            })
        } else
            fireAlert();
    }

    const fireAlert = () => {
        alertRef.current.classList.add('alert-visible');
        setTimeout(() => {
            alertRef.current.classList.remove('alert-visible');
        }, 2000);
    }


    return <Box id='route-page-wrapper'>
        {isDriver &&
            <ConfirmDialog isOpen={isDialogOpen} title={getTitleText()} text={getDialogText()}
                           onClose={() => handleDialogClose()}
                           onConfirm={() => handleDialogConfirm()}/>}
        {ride && !isLoading
            ? <Box className='route-info-wrapper'>
                <Alert
                    icon={ride.existing_request_id ? <WarningAmberIcon className='check-icon'/> :
                        <CheckIcon className='check-icon'/>}
                    className={ride.existing_request_id ? 'alert orange' : 'alert green'}
                    ref={alertRef}
                >
                    {!ride?.existing_request_id ? t('REQUEST_SENT') : t('REQUEST_HAS_ALREADY_BEEN_SENT')}
                </Alert>
                <Box className='route-info-container'>
                    <Typography variant='h3'
                                className='date'>{getDateText(dayjs(ride.departure_time, 'YYYY-MM-DD HH:mm:ss'))}</Typography>
                    <Typography variant='h3' className='date'>{format(ride.departure_time, 'HH:mm')}</Typography>
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
                        <Typography fontWeight='bold'>{t('BIO')}:</Typography>
                        <Typography variant='body2' className='bio'>{ride.driver.bio}</Typography>
                    </Box>
                    {isDriver &&
                        <Box className='is-driver-container'>
                            <Divider className='divider'/>
                            <Box className='accepted-passengers-container'>
                                <Typography variant='h6'>
                                    {t('ACCEPTED_PASSENGERS')}:
                                    {ride.total_seats - ride.available_seats}
                                </Typography>
                                <Box className='users-list'>
                                    {acceptedRequests.map((request) => (
                                        <Box className='user-list-item'>
                                            <Box className='pair'>
                                                <img
                                                    src={request.passenger.profile_picture ? request.passenger.profile_picture : Anon_Photo}
                                                    alt='driver-photo'
                                                    className='profile-picture'/>
                                                <Typography variant='h6'>{request.passenger.name}</Typography>
                                            </Box>
                                            <Box className='pair'>
                                                <img className='chat-icon' src={Chat_Icon} alt='chat'/>
                                                <Typography
                                                    className='contact-user-text'>{t('CONTACT')} {request.passenger.name}</Typography>
                                            </Box>
                                            <Button variant='contained' size='small' color='error'
                                                    className='button'
                                                    onClick={() => handleRemoveClick(request)}>{t('REMOVE')}</Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            <Divider className='divider'/>
                            <Box className='accepted-passengers-container'>
                                <Typography variant='h6'>
                                    {t('PENDING_REQUESTS')}: {pendingRequests.length}
                                </Typography>
                                <Box className='users-list'>
                                    {pendingRequests.map((request) => (
                                        <Box className='user-list-item'>
                                            <Box className='pair'>
                                                <img
                                                    src={request.passenger.profile_picture ? request.passenger.profile_picture : Anon_Photo}
                                                    alt='driver-photo'
                                                    className='profile-picture'/>
                                                <Typography variant='h6'>{request.passenger.name}</Typography>
                                            </Box>
                                            <Box className='pair'>
                                                <img className='chat-icon' src={Chat_Icon} alt='chat'/>
                                                <Typography
                                                    className='contact-user-text'>{t('CONTACT')} {request.passenger.name}</Typography>
                                            </Box>
                                            <Box>
                                                <Button variant='contained' size='small' color='error'
                                                        className='button button-green'
                                                        onClick={() => handleAcceptRequest(request)}>{t('ACCEPT')}</Button>
                                                <Button variant='contained' size='small' color='error'
                                                        className='button'
                                                        onClick={() => handleRejectClick(request)}>{t('DECLINE')}</Button>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    }
                </Box>
                {!isDriver
                    ? <Button className={!ride.existing_request_id ? 'book-now-button green' : 'book-now-button red'}
                              variant='contained'
                              onClick={() => handleRequestClick()} disabled={isWaiting}>
                        {!isWaiting
                            ? (!ride.existing_request_id ? t('REQUEST_A_RIDE') : t('CANCEL_REQUEST'))
                            : <Hourglass colors={['#ffffff', '#ffffff']} height='32'/>
                        }
                    </Button>
                    : <Button className='book-now-button green' variant='contained' onClick={() => navigate(`/edit/${ride.id}`)}>
                        {t('EDIT_RIDE')}
                    </Button>
                }
            </Box>
            :
            <Box className='loader-container'>
                <Loader/>
            </Box>
        }
    </Box>
}
