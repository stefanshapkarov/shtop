import {Box, Typography} from "@mui/material";
import './your-rides.scss'
import React, {useEffect, useRef, useState} from "react";
import SteeringWheel from "../../shared/styles/icons/steering_wheel.png";
import Passenger from "../../shared/styles/icons/passenger.png";
import {useTranslation} from "react-i18next";
import {Loader} from "../../shared/components/loader/Loader";
import {RouteCard} from "../../shared/components/route-card/RouteCard";
import {Hourglass} from "react-loader-spinner";
import {Ride} from "../../models/ride/Ride";
import {getRidesForLoggedUser} from "../../services/api";
import {RideStatus} from "../../models/ride-status/RideStatus";
import RidePendingIcon from '../../shared/styles/icons/pending.png'
import RideCompletedIcon from '../../shared/styles/icons/finished.png'


export const YourRides = () => {

    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExpanding, setIsExpanding] = useState<boolean>(false)
    const [canExpand, setCanExpand] = useState(true);
    const [filteredRoutes, setFilteredRoutes] = useState<Ride[]>([]);
    const routesListRef = useRef<HTMLDivElement>(null);
    const [asDriver, setAsDriver] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [selectedStatus, setSelectedStatus] = useState<RideStatus>(RideStatus.completed);

    const statusOptions = [
        {
            name: 'PENDING',
            value: RideStatus.pending,
            icon: RidePendingIcon
        },
        {
            name: 'COMPLETED',
            value: RideStatus.completed,
            icon: RideCompletedIcon
        }
    ]

    useEffect(() => {
        fetchRides(true);
    }, [asDriver, selectedStatus]);

    const fetchRides = (reset: boolean, expanding?: boolean) => {

        if (expanding)
            setIsExpanding(true);
        else {
            setIsLoading(true)
        }

        const pageTmp = reset ? 0 : page;

        getRidesForLoggedUser(asDriver, pageTmp + 1, selectedStatus).then(response => {

            setPage(response.meta.current_page);

            if (response.data.length < 15)
                setCanExpand(false);

            if (!reset) {
                setFilteredRoutes(prevState => [...prevState, ...response.data]);
            }
            else {
                setFilteredRoutes(response.data);
                setCanExpand(true);
            }
            })
            .finally(() => {
                setIsExpanding(false);
                setIsLoading(false);
            });
    }

    const handleScroll = () => {
        if (routesListRef.current) {
            const box = routesListRef.current;
            const scrollTop = box.scrollTop;
            const boxHeight = box.clientHeight;
            const scrollHeight = box.scrollHeight;

            if (scrollTop + boxHeight >= scrollHeight - 10 && !isLoading && canExpand) {
                fetchRides(false, true);
            }
        }
    }

    const updateRouteCanRequest = () => {
        console.log('updating...');
    };

    const handleFilterChange = (index: boolean) => {
        setAsDriver(index);
    }

    return <Box id='your-rides-container'>
        <Typography variant='h2' className='title'>{t('MY_RIDES')}</Typography>
        <Box className='search-route-page-content'>
            <Box className='filters-container'>
                {statusOptions.map((option, index) => (
                    <Box key={index} className={selectedStatus === option.value ? 'filter-element selected small' : 'filter-element small'}
                         onClick={() => setSelectedStatus(option.value)}>
                        <img src={option.icon} alt={option.name} className='icon-small'/>
                        <Typography variant='h5'>{t(option.name)}</Typography>
                    </Box>
                ))}
            </Box>
            <Box className='filters-container'>
                <Box className={!asDriver ? 'filter-element selected big' : 'filter-element big'}
                     onClick={() => handleFilterChange(false)}>
                    <img src={Passenger} alt='As passanger' className='icon'/>
                    <Typography variant='h4'>{t('PASSENGER_U')}</Typography>
                </Box>
                <Box className={asDriver ? 'filter-element selected big' : 'filter-element big'}
                     onClick={() => handleFilterChange(true)}>
                    <img src={SteeringWheel} alt='As Driver' className='icon'/>
                    <Typography variant='h4'>{t('DRIVER')}</Typography>
                </Box>
            </Box>
            <Box className='content'>
                {isLoading
                    ?
                    <Loader/>
                    : (filteredRoutes.length === 0
                            ? <Typography variant='h4'
                                          className='no-rides-text'>
                                {t('THERE_ARE_NO_COMPLETED_RIDES_WITH_ROLE')}
                                <strong>{asDriver ? t('DRIVER') : t('PASSENGER_U')}</strong>
                                {t('AND_STATUS')}
                                <strong>{selectedStatus === RideStatus.pending ? t('PENDING') : t('COMPLETED')}</strong>
                    </Typography>
                            : <Box className='routes-list' ref={routesListRef} onScroll={() => handleScroll()}>
                                {filteredRoutes.map((route) => (
                                    <RouteCard ride={route} moreStyles={true} key={route.id}
                                               updateRides={updateRouteCanRequest}/>
                                ))}
                            </Box>
                    )
                }
                {isExpanding &&
                    <Box className='hourglass'><Hourglass colors={['#5ea79d', '#5ea79d']} height={32}/></Box>}
            </Box>
        </Box>
    </Box>
}