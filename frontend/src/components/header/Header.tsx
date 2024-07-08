import LanguageSwitcher from "../language-switcher/LanguageSwitcher";
import {Box, Grid, Link, Typography} from "@mui/material";
import Logo from '../../shared/styles/images/logo.png'
import AI_Icon from '../../shared/styles/icons/ai_icon.png'
import Car_Icon from '../../shared/styles/icons/car_icon.png'
import Share_Icon from '../../shared/styles/icons/share_transport_icon.png'
import './header.scss'
import {useTranslation} from "react-i18next";
import {HeaderElementType} from "./types/HeaderElementType";

export const Header = () => {
    const {t} = useTranslation()

    const headerElements: HeaderElementType[] = [
        {imageSrc: AI_Icon, text: t('SHTOP_AI'), href: '/shtop-ai'},
        {imageSrc: Car_Icon, text: t('FIND_TRANSPORT'), href: '/search-route'},
        {imageSrc: Share_Icon, text: t('SHARE_TRANSPORT'), href: '/share-route'}
    ];

    return <Grid container xs={12} id='header-container'>
        <Grid item xs={12} lg={4}>
            <Link href='/'>
                <img src={Logo} className='logo'/>
            </Link>
        </Grid>
        {headerElements.map((headerElement, index) => {
            return <Grid item container xs={12} lg={2} key={index} className='header-element-container'>
                <Link href={headerElement.href} className='header-element'>
                    <img src={headerElement.imageSrc} className='icon'/>
                    <Typography className='header-element-text' variant='h5'>{headerElement.text}</Typography>
                </Link>
            </Grid>
        })}
        <Grid item container xs={12} lg={2} className='header-element-container'>
            <LanguageSwitcher/>
        </Grid>
    </Grid>
}
