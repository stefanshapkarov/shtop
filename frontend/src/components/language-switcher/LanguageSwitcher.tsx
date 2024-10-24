import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IconButton} from "@mui/material";
import {GB, MK} from 'country-flag-icons/react/3x2'
import './language-switcher.scss'


const LanguageSwitcher = () => {
    const {i18n} = useTranslation();
    const [isMacedonian, setIsMacedonian] =
        useState<boolean>(localStorage.getItem('language') === 'mk');

    const changeLanguage = () => {
        if (isMacedonian) {
            i18n.changeLanguage('en');
            localStorage.setItem('language', 'en')
        }
        else {
            i18n.changeLanguage('mk');
            localStorage.setItem('language', 'mk')
        }
        setIsMacedonian(prevState => !prevState);
        window.location.reload();
    };

    return (<IconButton disableRipple id='language-picker' onClick={() => changeLanguage()}>
            {isMacedonian ? <MK/> : <GB/>}
        </IconButton>
    );
};

export default LanguageSwitcher;
