import React, {useEffect, useState} from 'react';
import {
    Drawer,
    Grid,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
    useMediaQuery
} from '@mui/material';
import {useTranslation} from "react-i18next";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageSwitcher from "../language-switcher/LanguageSwitcher";
import Logo from '../../shared/styles/images/logo.png';
import AI_Icon from '../../shared/styles/icons/ai_icon.png';
import Car_Icon from '../../shared/styles/icons/car_icon.png';
import Share_Icon from '../../shared/styles/icons/share_transport_icon.png';
import './header.scss';
import {HeaderElementType} from "./types/HeaderElementType";
import { logout } from "../../services/api";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:1200px)');
    const [isAuth, setIsAuth] = useState(false);
    const { user } = useAuth() as { user: any };

    useEffect(() => {
        if (user) {
            setIsAuth(true);
        }
        else {
            setIsAuth(false);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            setIsAuth(false);
            console.log("logged out");
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Tab') {
            return;
        }
        setDrawerOpen(open);
    };


    const headerElements: HeaderElementType[] = [
        {imageSrc: AI_Icon, text: t('YOUR-RIDES'), href: '/my-rides'},
        {imageSrc: Car_Icon, text: t('FIND_TRANSPORT'), href: '/search-route'},
        {imageSrc: Share_Icon, text: t('SHARE_TRANSPORT'), href: '/share-transport'}
    ];

    return (
        <Grid container alignItems="center" id='header-container'>
            <Grid item xs={6} lg={2}>
                <Link href='/'>
                    <img src={Logo} alt='shtop' className='logo' />
                </Link>
            </Grid>
            {isMobile ? (
                <>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <IconButton onClick={toggleDrawer(true)} size="large">
                            <MenuIcon style={{ fontSize: '1.5rem' }} />
                        </IconButton>
                    </Grid>
                    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                        <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} style={{ width: 250 }}>
                            {headerElements.map((headerElement, index) => (
                                <ListItem button key={index} style={{ padding: '8px 16px' }}>
                                    <Link href={headerElement.href} className='header-element' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                        <img alt={headerElement.text} src={headerElement.imageSrc} className='icon' style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                                        <ListItemText primary={headerElement.text} primaryTypographyProps={{ style: { fontSize: '0.875rem' } }} />
                                    </Link>
                                </ListItem>
                            ))}

                            {isAuth ? (
                                <>
                                    {/* <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="/my-rides" style={{ textDecoration: 'none', color: 'inherit' }}>{t("YOUR-RIDES")}</Link>
                                    </ListItem> */}
                                    <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="http://localhost:8000/chatify/" style={{ textDecoration: 'none', color: 'inherit' }}>{t("INBOX")}</Link>
                                    </ListItem>
                                    <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>{t("PROFILE")}</Link>
                                    </ListItem>
                                    <ListItem button style={{ padding: '8px 16px' }} onClick={handleLogout}>
                                        <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>{t("LOGOUT")}</Link>
                                    </ListItem>
                                </>
                            ) : (
                                <>
                                    <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>{t("LOGIN-B-1")}</Link>
                                    </ListItem>
                                    <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="/register" style={{ textDecoration: 'none', color: 'inherit' }}>{t("REGISTER")}</Link>
                                    </ListItem>
                                </>
                            )}
                            <ListItem button style={{ padding: '8px 16px' }}>
                                <LanguageSwitcher />
                            </ListItem>
                        </List>
                    </Drawer>
                </>
            ) : (
                <>
                    {headerElements.map((headerElement, index) => (
                        <Grid item container xs={12} lg={2} key={index} className='header-element-container'>
                            <Link href={headerElement.href} className='header-element'>
                                <img alt={headerElement.text} src={headerElement.imageSrc} className='icon' />
                                <Typography className='header-element-text' variant='h5'>{headerElement.text}</Typography>
                            </Link>
                        </Grid>
                    ))}
                    <Grid item xs={12} lg={1} className='header-element-container' style={{ textAlign: 'right' }}>
                        <IconButton className="profile-icon-button" onClick={handleMenuClick} size="large">
                            <AccountCircleIcon className="profile-icon" style={{ fontSize: '3rem' }} />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
    {isAuth
        ? [
            <MenuItem key="inbox" onClick={handleMenuClose}>
                <Link href="http://localhost:8000/chatify/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {t("INBOX")}
                </Link>
            </MenuItem>,
            <MenuItem key="profile" onClick={handleMenuClose}>
                <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {t("PROFILE")}
                </Link>
            </MenuItem>,
            <MenuItem key="logout" onClick={() => { handleMenuClose(); handleLogout(); }}>
                {t("LOGOUT")}
            </MenuItem>
        ]
        : [
            <MenuItem key="login" onClick={handleMenuClose}>
                <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {t("LOGIN-B-1")}
                </Link>
            </MenuItem>,
            <MenuItem key="register" onClick={handleMenuClose}>
                <Link href="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {t("REGISTER")}
                </Link>
            </MenuItem>
        ]
    }
</Menu>
                    </Grid>
                    <Grid item container xs={12} lg={2} className='header-element-container'>
                        <LanguageSwitcher />
                    </Grid>
                </>
            )}
        </Grid>
    );
};
