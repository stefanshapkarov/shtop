import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "../../services/api";

export const HomePage = () => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {

        const query = new URLSearchParams(window.location.search);
        const token = query.get('token');
        // Check if user is logged in on component mount or app load
        if(token){
            localStorage.setItem('accessToken', token);
            setIsAuth(true);
            window.location.href = '/';
        }
        else{
        const checkLoggedIn = async () => {
            // Example: Check local storage for authentication token or user credentials
            console.log(localStorage.getItem("accessToken"));
            const isAuth = localStorage.getItem("accessToken") !== null; // Corrected 'accessToken'
            setIsAuth(isAuth);
            // No need to redirect here, just set state based on token presence
        };

        checkLoggedIn();}
    }, []);


    // useEffect(() => {
    //     const query = new URLSearchParams(window.location.search);
    //     const token = query.get('token');
        
    //     if (token) {
    //         localStorage.setItem('accessToken', token);
    //         setIsAuth(true);
    //         window.location.href = '/'; // Redirect to home page
    //     } else {
    //         const checkLoggedIn = async () => {
    //             const accessToken = localStorage.getItem('accessToken');
    //             if (accessToken) {
    //                 setIsAuth(true);
    //                 window.location.href = '/'; // Redirect to home page if logged in
    //             }
    //         };

    //         checkLoggedIn();
    //     }
    // }, []);

    const handleLogout = async () => {
        try {
            await logout(); // Assuming logout function clears authentication token
            localStorage.removeItem("accessToken"); // Clear token from local storage
            setIsAuth(false); // Update authentication state
            console.log("logged out");
            window.location.reload();
            // window.location.href = "/login"; // Redirect to login page after logout
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <>
            <div>{t("HOME_PAGE_TITLE")}</div>
            {isAuth ? (
                <button onClick={handleLogout}>{t("LOGOUT")}</button> // Show logout button if authenticated
            ) : (
                <p>{t("NOT_LOGGED_IN")}</p> // Show message if not authenticated
            )}
        </>
    );
};

export default HomePage;
