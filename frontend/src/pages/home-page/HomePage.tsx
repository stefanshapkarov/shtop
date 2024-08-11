import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {Autocomplete, Box, Button, TextField, Typography} from "@mui/material";
import HomePageLogo from '../../shared/styles/images/home-page-logo.png';
import './home-page.scss';
import {cities_en} from "../../models/cities/cities_en";
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {getInitialLanguage} from "../../i18";
import {cities_mk} from "../../models/cities/cities_mk";
import Coins from '../../shared/styles/icons/coins_icon.png'
import Profile from '../../shared/styles/icons/profile_icon.png'
import Lightning from '../../shared/styles/icons/lightning_icon.png'
import Robot from '../../shared/styles/images/ai_robot.png'
import { useAuth } from '../../context/AuthContext';


import {InfoCard} from "./components/info-card/InfoCard";

import { getCurrentUser, logout } from "../../services/api";

export const HomePage = () => {

    const {t} = useTranslation();
    const [locationFrom, setLocationFrom] = useState<string | null>(null);
    const [locationTo, setLocationTo] = useState<string | null>(null);
    const [date, setDate] = useState<any>(null);
    const [numPassangers, setNumPassangers] = useState<number | null>(null);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const { user } = useAuth() as { user: any };
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setIsAuth(true);
        }
      }, [user, navigate]);    



    // const handleLogout = async () => {
    //     try {
    //         await logout();
    //         localStorage.removeItem("accessToken");
    //         setIsAuth(false);
    //         console.log("logged out");
    //         window.location.reload();
    //         // window.location.href = "/login";
    //     } catch (error) {
    //         console.error("Logout error:", error);
    //     }
    // };

    const handleSearch = () => {
        const queryParams = new URLSearchParams();

        if (locationFrom)
            queryParams.append('from', getInitialLanguage() === 'mk' ? cities_en[cities_mk.indexOf(locationFrom)] : locationFrom);
        if (locationTo)
            queryParams.append('to', getInitialLanguage() === 'mk' ? cities_en[cities_mk.indexOf(locationTo)] : locationTo);
        if (date) queryParams.append('date', dayjs(date).format('DD-MM-YYYY'));
        if (numPassangers && numPassangers >= 1) queryParams.append('numPassangers', numPassangers.toString());

        navigate(`/search-route?${queryParams.toString()}`);
    };


    return <>
        <Box id='homepage-container'>
            <>

                {isAuth ? (
                    <p>{t("LOGGED_IN")}</p>
                ) : (
                    <p>{t("NOT_LOGGED_IN")}</p>
                )}
            </>
            <Box className='logo-container'>
                <Typography variant='h3' className='title'>{t('HOME_PAGE_TITLE')}</Typography>
                <img src={HomePageLogo} alt='home-page-logo' className='home-page-logo'/>
            </Box>
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
                        <DatePicker format='DD/MM/YYYY' label={t('DATE')} value={date} onChange={value => setDate(value)}
                                    className='search-field'/>
                    </DemoContainer>
                </LocalizationProvider>
                <TextField label={t('NUM_PEOPLE')} className='search-field' value={numPassangers} type='number'
                           onChange={(event) => setNumPassangers(Number.parseInt(event.target.value))}/>
                <Button variant='contained' className='search-button'
                        onClick={() => handleSearch()}>{t('SEARCH')}</Button>
            </Box>
            <Box className='infocards-container'>
                <InfoCard imageSrc={Coins} title={t('YOU_PICK_OF_RIDES_AT_LOW_PRICES')} text={t('NO_MATTER_WHERE_YOURE_GOING')}/>
                <InfoCard imageSrc={Profile} title={t('TRUST_WHO_YOU_TRAVEL')} text={t('WE_TAKE_TIME')}/>
                <InfoCard imageSrc={Lightning} title={t('SCROLL_TAP_GO')} text={t('BOOKING_A_RIDE_HAS_NEVER')}/>
            </Box>
            <Box className='ai-info-container'>
                <Box className={'ai-info-content'}>
                <img src={Robot} className='robot-image'/>
                <Typography variant='h4' className='ai-text'>{t('AI_TEXT')}</Typography>
                </Box>
            </Box>
        </Box>
    </>
}


export default HomePage;
