import React, { useState, useEffect } from 'react';
import { Grid, Link, Typography, IconButton, Menu, MenuItem, useMediaQuery, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useTranslation } from "react-i18next";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageSwitcher from "../language-switcher/LanguageSwitcher";
import Logo from '../../shared/styles/images/logo.png';
import AI_Icon from '../../shared/styles/icons/ai_icon.png';
import Car_Icon from '../../shared/styles/icons/car_icon.png';
import Share_Icon from '../../shared/styles/icons/share_transport_icon.png';
import './header.scss';
import { HeaderElementType } from "./types/HeaderElementType";
import { logout } from "../../services/api";

export const Header = () => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:1200px)');
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkLoggedIn = () => {
            const isAuthenticated = localStorage.getItem('accessToken') !== null;
            setIsAuth(isAuthenticated);
            isAuthenticated ? console.log('logged in') : console.log('logged out');
        };
        checkLoggedIn();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("accessToken");
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
        { imageSrc: AI_Icon, text: t('SHTOP_AI'), href: '/shtop-ai' },
        { imageSrc: Car_Icon, text: t('FIND_TRANSPORT'), href: '/search-route' },
        { imageSrc: Share_Icon, text: t('SHARE_TRANSPORT'), href: '/share-route' }
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
                                    <Link href={headerElement.href} className='header-element' style={{ display: 'flex', alignItems: 'center' }}>
                                        <img alt={headerElement.text} src={headerElement.imageSrc} className='icon' style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                                        <ListItemText primary={headerElement.text} primaryTypographyProps={{ style: { fontSize: '0.875rem' } }} />
                                    </Link>
                                </ListItem>
                            ))}

                            {isAuth ? (
                                <>
                                    <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="/your-rides" style={{ textDecoration: 'none', color: 'inherit' }}>Your Rides</Link>
                                    </ListItem>
                                    <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="/inbox" style={{ textDecoration: 'none', color: 'inherit' }}>Inbox</Link>
                                    </ListItem>
                                    <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
                                    </ListItem>
                                    <ListItem button style={{ padding: '8px 16px' }} onClick={handleLogout}>
                                        <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Logout</Link>
                                    </ListItem>
                                </>
                            ) : (
                                <>
                                    <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
                                    </ListItem>
                                    <ListItem button style={{ padding: '8px 16px' }}>
                                        <Link href="/register" style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link>
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
                            {isAuth ? (
                                <>
                                    <MenuItem onClick={handleMenuClose}><Link href="/your-rides">Your Rides</Link></MenuItem>
                                    <MenuItem onClick={handleMenuClose}><Link href="/inbox">Inbox</Link></MenuItem>
                                    <MenuItem onClick={handleMenuClose}><Link href="/profile">Profile</Link></MenuItem>
                                    <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>Logout</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={handleMenuClose}><Link href="/login">Login</Link></MenuItem>
                                    <MenuItem onClick={handleMenuClose}><Link href="/register">Register</Link></MenuItem>
                                </>
                            )}
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
