import {Alert, Autocomplete, Box, Button, Checkbox, Divider, Radio, TextField, Typography} from "@mui/material";
import {useLocation} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import './search-route-page.scss'
import {useTranslation} from "react-i18next";
import {getInitialLanguage} from "../../i18";
import {cities_mk} from "../../models/cities/cities_mk";
import {cities_en} from "../../models/cities/cities_en";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckIcon from "@mui/icons-material/Check";


export const SearchRoute = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [locationFrom, setLocationFrom] = useState<string | null>(queryParams.get('from'));
    const [locationTo, setLocationTo] = useState<string | null>(queryParams.get('to'));
    const initialDate = queryParams.get('date');
    const [date, setDate] = useState<Dayjs | null>(initialDate ? dayjs(initialDate, 'DD-MM-YYYY') : dayjs(new Date(Date.now())));
    const [numPassangers, setNumPassangers] = useState<string | null>(queryParams.get('numPassangers'));
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
    const [whereToText, setWhereToText] = useState<string>('');
    const [update, setUpdate] = useState<number>(0)
    const routesListRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchRides();
    }, [])

    useEffect(() => {
        if (update !== 0) {
            let routesTemp: Ride[] = [];
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
            if (routesListRef.current) routesListRef.current.scrollTop = 0;
        }
    }, [update])

    const fetchRides = async () => {
        setIsLoading(true)
        const rides = await fetchAllRides(getLocationFrom(), getLocationTo(), getNumPassangers(), getDate());
        setRoutes(rides)
        setFilteredRoutes(rides)
        setWhereToText(getWhereToText())
        setIsLoading(false);
    }

    const getLocationFrom = () => {
        return getInitialLanguage() === 'mk' && locationFrom ? cities_en[cities_mk.indexOf(locationFrom)] : locationFrom
    }

    const getLocationTo = () => {
        return getInitialLanguage() === 'mk' && locationTo ? cities_en[cities_mk.indexOf(locationTo)] : locationTo
    }

    const getDate = () => {
        if (date)
            return format(date.toDate(), "yyyy-MM-dd")
        return null
    }

    const getNumPassangers = () => {
        if (numPassangers)
            return parseInt(numPassangers)
        return null
    }

    const handleSortChange = (selectedIndex: number) => {
        setSortingOptions(prevState =>
            prevState.map((option, index) => ({
                ...option,
                isSelected: index === selectedIndex
            }))
        );
        setUpdate(prevState => prevState + 1);
    };

    const getWhereToText = () => {
        let from = locationFrom;
        let to = locationTo;
        if (getInitialLanguage() === 'mk') {
            if (locationFrom)
                from = cities_mk[cities_en.indexOf(locationFrom)];
            if (locationTo)
                to = cities_mk[cities_en.indexOf(locationTo)]
        }
        if (from && to) {
            return `${from} → ${to}`
        }
        else if (from)
            return `${from} → ${t('ANYWHERE')}`
        else if (to)
            return `${t('ANYWHERE')} → ${to}`
        else
            return ''
    }

    const handleFilterChange = async (selectedIndex: number) => {
        setDepartures(prevState =>
            prevState.map((departure, index) => ({
                ...departure,
                isChecked: index === selectedIndex ? !departure.isChecked : departure.isChecked
            }))
        );
        setUpdate(prevState => prevState + 1);
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
        setUpdate(prevState => prevState + 1)
    }

    const updateRouteCanRequest = (rideId: number, canRequest: boolean) => {
        setRoutes(prevState =>
            prevState.map(prevRoute =>
                prevRoute.id === rideId
                    ? { ...prevRoute, canRequest: canRequest }
                    : prevRoute
            ));
        setFilteredRoutes(prevState =>
            prevState.map(prevRoute =>
                prevRoute.id === rideId
                    ? { ...prevRoute, canRequest: canRequest }
                    : prevRoute
            )
        );
    };


    return <>
        <Box id='search-route-page-container'>
            <Typography variant='h2' className='title'>{t('WHERE_TO')}</Typography>
            <Box className='search-route-container'>
                <Autocomplete
                    value={locationFrom}
                    onChange={(event, value) => setLocationFrom(value)}
                    renderInput={(params) => <TextField {...params} label={t('DEPARTURE_FROM')}/>}
                    options={getInitialLanguage() === 'mk' ? cities_mk : cities_en}
                    className='search-field'
                />
                <Autocomplete
                    value={locationTo}
                    onChange={(event, value) => setLocationTo(value)}
                    renderInput={(params) => <TextField {...params} label={t('ARRIVAL_TO')}/>}
                    options={getInitialLanguage() === 'mk' ? cities_mk : cities_en}
                    className='search-field'
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}
                                   sx={{marginTop: '-0.5rem'}}>
                        <DatePicker disablePast={true} format='DD/MM/YYYY' label={t('DATE')} value={dayjs(date)}
                                    onChange={value => {
                                        if (value)
                                            setDate(value)
                                        else
                                            setDate(null)
                                    }}
                                    className='search-field'/>
                    </DemoContainer>
                </LocalizationProvider>
                <TextField label={t('NUM_PEOPLE')} className='search-field' value={numPassangers} type='number'
                           onChange={(event) => setNumPassangers(event.target.value)}/>
                <Button variant='contained' className='search-button'
                        onClick={() => fetchRides()}>{t('SEARCH')}</Button>
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
                                    <Typography>{whereToText}</Typography>
                                    <Typography>{filteredRoutes.length} {t('AVAILABLE')}</Typography>
                                    <Box className='routes-list' ref={routesListRef}>
                                        {filteredRoutes.map((route) => (
                                            <RouteCard ride={route} moreStyles={true} key={route.id} updateRides={updateRouteCanRequest}/>
                                        ))}
                                    </Box>
                                </Box>
                        )
                    }
                </Box>
            </Box>
        </Box>
    </>
}
