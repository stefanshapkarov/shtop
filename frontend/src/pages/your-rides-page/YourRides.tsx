import {Box, Divider, Typography} from "@mui/material";
import {RoutesSearchBar} from "../../shared/components/routes-search-bar/RoutesSearchBar";
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
import {Dayjs} from "dayjs";
import {format} from "date-fns";

export const YourRides = () => {

    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExpanding, setIsExpanding] = useState<boolean>(false)
    const [canExpand, setCanExpand] = useState(true);
    const [filteredRoutes, setFilteredRoutes] = useState<Ride[]>([]);
    const routesListRef = useRef<HTMLDivElement>(null);
    const [asDriver, setAsDriver] = useState<boolean>(false);
    const [searchFilters, setSearchFilters] = useState({
        locationFrom: null as string | null,
        locationTo: null as string | null,
        date: null as Dayjs | null,
    });
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        fetchRides(true);
    }, [searchFilters, asDriver]);

    const fetchRides = (reset: boolean, expanding?: boolean) => {

        if (expanding)
            setIsExpanding(true);
        else {
            setIsLoading(true)
        }

        const pageTmp = reset ? 0 : page;

        getRidesForLoggedUser(asDriver, pageTmp + 1, 'completed', searchFilters.locationFrom, searchFilters.locationTo, getDate(searchFilters.date)).then(response => {

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

    const getDate = (date: Dayjs | null) => {
        return date ? format(date.toDate(), "yyyy-MM-dd") : null;
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

    const handleSearch = (locationFrom: string | null, locationTo: string | null, date: Dayjs | null) => {
        setSearchFilters({
            locationFrom: locationFrom,
            locationTo: locationTo,
            date: date
        })
    }

    const handleFilterChange = (index: boolean) => {
        setAsDriver(index);
    }

    return <Box id='your-rides-container'>
        <Typography variant='h2' className='title'>{t('MY_RIDES')}</Typography>
        <RoutesSearchBar handleSearch={handleSearch}/>
        <Box className='search-route-page-content'>
            <Box className='filters-container'>
                <Box className={!asDriver ? 'filter-element selected' : 'filter-element'}
                     onClick={() => handleFilterChange(false)}>
                    <img src={Passenger} alt='As passanger' className='icon'/>
                    <Typography variant='h4'>{t('PASSENGER_U')}</Typography>
                </Box>
                <Divider orientation='vertical' className='divider'/>
                <Box className={asDriver ? 'filter-element selected' : 'filter-element'}
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
                                          className='no-rides-text'>{t('THERE_ARE_NO_COMPLETED_RIDES_WITH_ROLE')} {asDriver ? t('DRIVER') : t('PASSENGER_U')}</Typography>
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