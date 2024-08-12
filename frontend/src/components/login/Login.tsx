import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './login.scss';


const Login: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { login, user, logout, loading } = useAuth() as { login: Function, user: any, logout: Function, loading: boolean };

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user, loading, navigate]);


    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    };
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        try {
            await login(email, password, rememberMe);
            navigate('/');
        } catch (error: any) {
            console.error('Login error:', error.message);
            setError(error.message);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/auth/google';
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:8000/auth/facebook';
    };

    return (
        <div className="login-container">
            <h2>{t('LOGIN')}</h2>
            <p>{t('WELCOME-BACK')}</p>
            <div className="social-login">
                <button className="google-login" onClick={handleGoogleLogin}>
                    <GoogleIcon style={{ marginRight: '8px', color: 'red' }} />
                    Google
                </button>
                <button className="facebook-login" onClick={handleFacebookLogin}>
                    <FacebookIcon style={{ marginRight: '8px', color: 'blue' }} />
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
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />
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
