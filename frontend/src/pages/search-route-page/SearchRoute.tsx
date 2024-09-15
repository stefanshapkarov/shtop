import {Box, Checkbox, Divider, Radio, Typography} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import './search-route-page.scss'
import {useTranslation} from "react-i18next";
import dayjs, {Dayjs} from "dayjs";
import ClockIcon from '../../shared/styles/icons/clock_icon.png'
import CoinsIcon from '../../shared/styles/icons/coins_icon_alt.png'
import StarIcon from '../../shared/styles/icons/star.png'
import VerifiedIcon from '../../shared/styles/icons/verified_icon.png'
import {RouteCard} from "../../shared/components/route-card/RouteCard";
import {Ride} from "../../models/ride/Ride";
import {fetchAllRides} from "../../services/api";
import {Loader} from "../../shared/components/loader/Loader";
import {format} from "date-fns";
import {RoutesSearchBar} from "../../shared/components/routes-search-bar/RoutesSearchBar";
import {Hourglass} from "react-loader-spinner";


export const SearchRoute = () => {
    const {t} = useTranslation();
    const [routes, setRoutes] = useState<Ride[]>([]);
    const [filteredRoutes, setFilteredRoutes] = useState<Ride[]>([]);
    const [sortingOptions, setSortingOptions] = useState([
        {imageSrc: ClockIcon, text: 'EARLIEST_DEPARTURE', isSelected: false},
        {imageSrc: CoinsIcon, text: 'LOWEST_PRICE', isSelected: false},
        {imageSrc: StarIcon, text: 'BEST_RATING', isSelected: false},
    ]);
    const [departutes, setDepartures] = useState([
        {text: '06:01 - 12:00', isChecked: true},
        {text: '12:01 - 18:00', isChecked: true},
        {text: '18:01 - 06:00', isChecked: true}
    ]);
    const [isVerifiedCheck, setIsVerifiedCheck] = useState<boolean>(false);
    const routesListRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExpanding, setIsExpanding] = useState<boolean>(false);
    const queryParams = new URLSearchParams(window.location.search);
    const [initialLocationFrom, setInitialLocationFrom] = useState<string | null>(queryParams.get('from'));
    const [initialLocationTo, setInitialLocationTo] = useState<string | null>(queryParams.get('to'));
    const [initialDate, setInitialDate] = useState<Dayjs | null>(queryParams.get('date') ? dayjs(queryParams.get('date'), 'DD-MM-YYYY') : null);
    const [page, setPage] = useState<number>(0);
    const getInitialNumPassengers = () => {
        const numPassangers: string | null = queryParams.get('numPassangers');
        return numPassangers ? parseInt(numPassangers) : null
    }
    const [initialNumPassangers, setInitialNumPassangers] = useState<number | null>(getInitialNumPassengers());
    const [finalPage, setFinalPage] = useState<boolean>(false)


    useEffect(() => {
        window.scrollTo(0, 0);
        fetchRides(initialLocationFrom, initialLocationTo, initialDate, initialNumPassangers, false);
    }, []);


    const updateRides = (rides?: Ride[]) => {
        let routesTemp: Ride[] = rides ? rides : [];
        let allUnchecked = true;

        if (departutes[0].isChecked) {
            routesTemp = routesTemp.concat(routes.filter(route => {
                const departure = dayjs(route.departure_time, 'YYYY-MM-DD HH:mm:ss');
                return departure.hour() >= 6 && departure.hour() < 12;
            }));
            allUnchecked = false;
        }
        if (departutes[1].isChecked) {
            routesTemp = routesTemp.concat(routes.filter(route => {
                const departure = dayjs(route.departure_time, 'YYYY-MM-DD HH:mm:ss');
                return departure.hour() >= 12 && departure.hour() < 18;
            }));
            allUnchecked = false;
        }
        if (departutes[2].isChecked) {
            routesTemp = routesTemp.concat(routes.filter(route => {
                const departure = dayjs(route.departure_time, 'YYYY-MM-DD HH:mm:ss');
                return departure.hour() >= 18 || departure.hour() < 6;
            }));
            allUnchecked = false;
        }
        if (allUnchecked) routesTemp = routes;

        if (isVerifiedCheck) {
            routesTemp = routesTemp.filter(route => route.driver.is_verified);
        }

        if (sortingOptions[0].isSelected) {
            routesTemp = routesTemp.sort((a, b) => dayjs(a.departure_time, 'YYYY-MM-DD HH:mm:ss').unix() - dayjs(b.departure_time, 'YYYY-MM-DD HH:mm:ss').unix());
        } else if (sortingOptions[1].isSelected) {
            routesTemp = routesTemp.sort((a, b) => a.price_per_seat - b.price_per_seat);
        } else if (sortingOptions[2].isSelected) {
            routesTemp = routesTemp.sort((a, b) => b.driver.rating - a.driver.rating);
        }
        setFilteredRoutes(routesTemp);
    }

    const handleScroll = () => {
        if (routesListRef.current) {
            const box = routesListRef.current;
            const scrollTop = box.scrollTop;
            const boxHeight = box.clientHeight;
            const scrollHeight = box.scrollHeight;

            if (scrollTop + boxHeight >= scrollHeight - 10) {
                fetchRides(initialLocationFrom, initialLocationTo, initialDate, initialNumPassangers, null)
            }
        }
    }

    const fetchRides = async (locationFrom: string | null, locationTo: string | null, date: Dayjs | null, numPassengers: number | null, update: boolean | null) => {
        let pageTmp = page;

        if (update !== null) {
            setIsLoading(true);
            if (routesListRef.current)
                routesListRef.current.scrollTop = 0;
            setFinalPage(false);
        } else if (update === null && !finalPage)
            setIsExpanding(true);

        if (update === true)
            pageTmp = 0;

        if (!finalPage || update !== null)
            fetchAllRides(locationFrom, locationTo, numPassengers, getDate(date), pageTmp + 1)
                .then(rides => {
                    if (rides.length === 0 && update === null) {
                        setFinalPage(true);
                        setIsExpanding(false);
                        setIsLoading(false);
                    } else {
                        if (pageTmp > 0) {
                            setRoutes(prevState => [...prevState, ...rides]);
                        } else if (pageTmp === 0) {
                            setRoutes(rides);
                        }
                        updateRides(rides);
                        setPage(pageTmp + 1);
                        if (update) {
                            setInitialLocationFrom(locationFrom);
                            setInitialLocationTo(locationTo);
                            setInitialDate(date);
                            setInitialNumPassangers(numPassengers);
                        }
                    }
                })
                // TODO: ADD CATCH THING TO HANDLE IF NO RIDES ARE RETURNED TO RESENT THE ROUTES TO []
                .finally(() => {
                    setIsLoading(false);
                    setIsExpanding(false);
                });
    };

    const getDate = (date: Dayjs | null) => {
        return date ? format(date.toDate(), "yyyy-MM-dd") : format(new Date(Date.now()), "yyyy-MM-dd")
    }

    const handleSortChange = (selectedIndex: number) => {
        setSortingOptions(prevState =>
            prevState.map((option, index) => ({
                ...option,
                isSelected: index === selectedIndex
            }))
        );
        updateRides();
    };

    const handleFilterChange = async (selectedIndex: number) => {
        setDepartures(prevState =>
            prevState.map((departure, index) => ({
                ...departure,
                isChecked: index === selectedIndex ? !departure.isChecked : departure.isChecked
            }))
        );
        updateRides();
    };

    const handleClearAllFilters = () => {
        setIsVerifiedCheck(false);
        setSortingOptions(prevState => prevState.map(option => ({
            ...option,
            isSelected: false
        })))
        setDepartures(prevState => prevState.map(option => ({
            ...option,
            isChecked: true
        })))
        setFilteredRoutes(routes)
    }

    const handleIsAuthorisedClick = () => {
        setIsVerifiedCheck(prevState => !prevState)
        updateRides();
    }

    const updateRouteCanRequest = (rideId: number, existingRequest: number | null) => {
        setRoutes(prevState =>
            prevState.map(prevRoute =>
                prevRoute.id === rideId
                    ? {...prevRoute, existing_request_id: existingRequest}
                    : prevRoute
            ));
        setFilteredRoutes(prevState =>
            prevState.map(prevRoute =>
                prevRoute.id === rideId
                    ? {...prevRoute, existing_request_id: existingRequest}
                    : prevRoute
            )
        );
    };


    return <>
        <Box id='search-route-page-container'>
            <Typography variant='h2' className='title'>{t('WHERE_TO')}</Typography>
            <Box className='search-routes-bar-wrapper'>
                <RoutesSearchBar locationFrom={initialLocationFrom}
                                 locationTo={initialLocationTo}
                                 numPassengers={initialNumPassangers}
                                 date={initialDate}
                                 handleSearch={fetchRides}/>
            </Box>
            <Box className='search-route-page-content'>
                <Box className='filters-container'>
                    <Box>
                        <Box className='sort-container-headers' onClick={() => handleClearAllFilters()}>
                            <Typography variant='h4'>{t('SORT_BY')}</Typography>
                            <span className='clear-all-button'>{t('CLEAR_ALL')}</span>
                        </Box>
                        {sortingOptions.map((option, index) => (
                            <Box key={index} className='sorting-option-container'
                                 onClick={() => handleSortChange(index)}>
                                <Box className='sorting-option-content-wrapper'>
                                    <Box className='sorting-option-content'>
                                        <img className='icon' src={option.imageSrc} alt={option.text}/>
                                        <Typography variant='h6'>{t(`${option.text}`)}</Typography>
                                    </Box>
                                    <Radio checked={option.isSelected} className='radio-button' disableRipple/>
                                </Box>
                            </Box>
                        ))}
                        <Divider className='divider'/>
                    </Box>
                    <Box>
                        <Box className='sort-container-headers'>
                            <Typography variant='h4'>{t('DEPARTURE_TIME')}</Typography>
                        </Box>
                        {departutes.map((departure, index) => (
                            <Box key={index} className='sorting-option-container'
                                 onClick={() => handleFilterChange(index)}>
                                <Box className='sorting-option-content-wrapper'>
                                    <Box className='sorting-option-content'>
                                        <Typography variant='h6'>
                                            {departure.text}
                                        </Typography>
                                    </Box>
                                    <Checkbox checked={departure.isChecked} className='radio-button'/>
                                </Box>
                            </Box>
                        ))}
                        <Divider className='divider'/>
                    </Box>
                    <Box>
                        <Box className='sort-container-headers'>
                            <Typography variant='h4'>{t('TRUST_AND_SAFETY')}</Typography>
                        </Box>
                        <Box className='sorting-option-container' onClick={() => handleIsAuthorisedClick()}>
                            <Box className='sorting-option-content-wrapper'>
                                <Box className='sorting-option-content'>
                                    <img className='icon' src={VerifiedIcon} alt='Verified'/>
                                    <Typography variant='h6'>
                                        {t('VERIFIED_PROFILE')}
                                    </Typography>
                                </Box>
                                <Checkbox checked={isVerifiedCheck} className='radio-button'/>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box className='content'>
                    {isLoading
                        ?
                        <Loader/>
                        : (filteredRoutes.length === 0
                                ? <Typography variant='h4'
                                              className='no-rides-text'>{t('NO_RIDES_AVAILABLE_AT_THE_MOMENT')}</Typography>
                                : <Box>
                                    <Typography>{filteredRoutes.length} {t('AVAILABLE')}</Typography>
                                    <Box className='routes-list' ref={routesListRef} onScroll={() => handleScroll()}>
                                        {filteredRoutes.map((route) => (
                                            <RouteCard ride={route} moreStyles={true} key={route.id}
                                                       updateRides={updateRouteCanRequest}/>
                                        ))}
                                    </Box>
                                </Box>
                        )
                    }
                    {isExpanding &&
                        <Box className='hourglass'><Hourglass colors={['#5ea79d', '#5ea79d']} height={32}/></Box>}
                </Box>
            </Box>
        </Box>
    </>
}
