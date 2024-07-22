import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { loginUser } from '../../services/api';
import './login.scss';
import { useTranslation } from 'react-i18next';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { blue } from '@mui/material/colors';

const Login: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState<boolean>(false); // State to track login status

    useEffect(() => {
        const checkLoggedIn = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                setIsAuth(true);
                window.location.href = '/'; // Redirect to home page if logged in
            }
        };

        checkLoggedIn();
    }, []);

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        try {
            const data = await loginUser(email, password, false); // Assuming loginUser function handles login
            localStorage.setItem('accessToken', data.accessToken); // Store authentication token in local storage
            setIsAuth(true); // Update login state
            window.location.href = '/'; // Redirect to home page
        } catch (error: any) {
            console.error('Login error:', error.message);
            setError(error.message);
        }
    };

    

    return (
        <div className="login-container">
            <h2>{t('LOGIN')}</h2>
            <p>{t('WELLCOME-BACK')}</p>
            <div className="social-login">
            <button className="google-login">
                <GoogleIcon style={{ marginRight: '8px', color: "red"  }} />
                Google
            </button>
            <button className="facebook-login">
                <FacebookIcon style={{ marginRight: '8px', color: "blue" }} />
                Facebook
            </button>
        </div>
            <div className="divider">{t("EMAIL")}</div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder={t("email")}
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder={t("password")}
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="options">
                    <label>
                        <input type="checkbox" />
                        {t("REMEMBER")}
                    </label>
                    <a href="#">{t("FORGOT-PASSWORD")}</a>
                </div>
                <button type="submit" className="login-button">{t("LOGIN-B")}</button>
            </form>
            {error && <p className="error">{error}</p>}

            <p className="create-account">
                {t("NO-ACCOUNT")} <a href="/register">{t("CREATE-ACC")}</a>
            </p>
        </div>
    );
};

export default Login;
