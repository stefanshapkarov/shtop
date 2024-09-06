import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Box, Typography} from "@mui/material";
import HomePageLogo from '../../shared/styles/images/home-page-logo.png';
import './home-page.scss';
import {useNavigate} from "react-router-dom";
import Coins from '../../shared/styles/icons/coins_icon.png'
import Profile from '../../shared/styles/icons/profile_icon.png'
import Lightning from '../../shared/styles/icons/lightning_icon.png'
import Robot from '../../shared/styles/images/ai_robot.png'

import {InfoCard} from "./components/info-card/InfoCard";

import {logout} from "../../services/api";
import {useAuth} from '../../context/AuthContext';
import {RoutesSearchBar} from "../../shared/components/routes-search-bar/RoutesSearchBar";

export const HomePage = () => {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const {user} = useAuth() as { user: any };

    useEffect(() => {
        if (user) {
            setIsAuth(true);
        }
    }, [user, navigate]);

    const checkLoggedIn = async () => {
        const accessToken = localStorage.getItem("accessToken")
        console.log("access token: " + accessToken);
        const isAuth = accessToken !== null && accessToken !== undefined;
        setIsAuth(isAuth);
    };

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("accessToken");
            setIsAuth(false);
            console.log("logged out");
            window.location.reload();
            // window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleSearch = (locationFrom: string | null, locationTo: string | null, date: string | null, numPassangers: number | null) => {
        const queryParams = new URLSearchParams();
        if (locationFrom)
            queryParams.append('from', locationFrom);
        if (locationTo)
            queryParams.append('to', locationTo);
        if (date)
            queryParams.append('date', date);
        if (numPassangers && numPassangers >= 1)
            queryParams.append('numPassangers', numPassangers.toString());

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
            <Box className='routes-search-bar-wrapper'>
                <RoutesSearchBar handleSearch={handleSearch}/>
            </Box>
            <Box className='infocards-container'>
                <InfoCard imageSrc={Coins} title={t('YOU_PICK_OF_RIDES_AT_LOW_PRICES')}
                          text={t('NO_MATTER_WHERE_YOURE_GOING')}/>
                <InfoCard imageSrc={Profile} title={t('TRUST_WHO_YOU_TRAVEL')} text={t('WE_TAKE_TIME')}/>
                <InfoCard imageSrc={Lightning} title={t('SCROLL_TAP_GO')} text={t('BOOKING_A_RIDE_HAS_NEVER')}/>
            </Box>
            <Box className='ai-info-container'>
                <Box className={'ai-info-content'}>
                    <img src={Robot} className='robot-image' alt='shtop-ai'/>
                    <Typography variant='h4' className='ai-text'>{t('AI_TEXT')}</Typography>
                </Box>
            </Box>
        </Box>
    </>
}
