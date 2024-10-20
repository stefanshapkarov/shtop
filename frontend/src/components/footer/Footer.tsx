import {Grid, Link, Typography} from "@mui/material";
import './footer.scss'
import {useTranslation} from "react-i18next";
import Logo from '../../shared/styles/images/logo.png'
import {getInitialLanguage} from "../../i18";
import {cities_en} from "../../models/cities/cities_en";
import {cities_mk} from "../../models/cities/cities_mk";

export const Footer = () => {

    const {t} = useTranslation()

    const popularRoutes = [
        {text: `${t('SKOPJE')} > ${t("VELES")}`, from: 'Skopje', to: 'Veles'},
        {text: `${t('GEVGELIJA')} > ${t("SKOPJE")}`, from: 'Gevgelija', to: 'Skopje'},
        {text: `${t('BITOLA')} > ${t("SKOPJE")}`, from: 'Bitola', to: 'Skopje'},
        {text: `${t('SKOPJE')} > ${t("OHRID")}`, from: 'Skopje', to: 'Veles'},
        {text: `${t('STRUMICA')} > ${t("SKOPJE")}`, from: 'Strumica', to: 'Skopje'}
    ]

    const aboutUsElements = [
        {text: `${t('ABOUT_US')}`, path: 'about-us'},
        {text: `${t('HOW_WE_WORK')}`, path: 'how-we-work'},
        {text: `${t('HELP_CENTER')}`, path: 'help-center'}
    ]

    const getCity = (city: string) => {
        return getInitialLanguage() === 'mk' ? cities_en[cities_mk.indexOf(city)] : city
    }

    return <Grid item container xs={12} id='footer-container'>
        <Grid item xs={12} lg={4} className='footer-element-container logos'>
            <Link href={'/'}>
                <img src={Logo} alt='logo' className='logo'/>
            </Link>
        </Grid>
        <Grid item xs={12} lg={4} className='footer-element-container links'>
            <Typography className='footer-element-title' variant='h4'>{t('MOST_POPULAR_ROUTES')}</Typography>
            {popularRoutes.map((route, index) => {
                return <Link key={index} className='footer-element-text' variant='h5'
                             href={`search-route?from=${getCity(route.from)}&to=${getCity(route.to)}`}>
                    {route.text}
                </Link>
            })}
        </Grid>
        <Grid item xs={12} lg={4} className='footer-element-container links'>
            <Typography className='footer-element-title' variant='h4'>{t('ABOUT_US')}</Typography>
            {aboutUsElements.map((element, index) => {
                return <Link key={index} href={element.path} variant='h5' className='footer-element-text'>
                    {element.text}
                </Link>
            })}
        </Grid>
    </Grid>
}
