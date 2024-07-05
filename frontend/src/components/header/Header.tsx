import LanguageSwitcher from "../language-switcher/LanguageSwitcher";
import {Box, Typography} from "@mui/material";
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
        {imageSrc: AI_Icon, text: t('SHTOP_AI')},
        {imageSrc: Car_Icon, text: t('FIND_TRANSPORT')},
        {imageSrc: Share_Icon, text: t('SHARE_TRANSPORT')}
    ];

    return <Box id='header-container'>
        <img src={Logo} className='logo'/>
        <Box className='header-elements-container'>
            {headerElements.map((headerElement, index) => {
               return <Box key={index} className='header-element'>
                    <img src={headerElement.imageSrc} className='icon'/>
                    <Typography className='header-element-text' variant='h6'>{headerElement.text}</Typography>
                </Box>
            })}
            <LanguageSwitcher/>
        </Box>
    </Box>
}
