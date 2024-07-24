import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "../../services/api";

export const HomePage = () => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {

        const query = new URLSearchParams(window.location.search);
        const token = query.get('token');
        if(token){
            localStorage.setItem('accessToken', token);
            setIsAuth(true);
            window.location.href = '/';
        }
        else{
        const checkLoggedIn = async () => {
            console.log(localStorage.getItem("accessToken"));
            const isAuth = localStorage.getItem("accessToken") !== null;
            setIsAuth(isAuth);
        };

        checkLoggedIn();}
    }, []);


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

    return (
        <>
            <div>{t("HOME_PAGE_TITLE")}</div>
            {isAuth ? (
                <button onClick={handleLogout}>{t("LOGOUT")}</button>
            ) : (
                <p>{t("NOT_LOGGED_IN")}</p>
            )}
        </>
    );
};

export default HomePage;
