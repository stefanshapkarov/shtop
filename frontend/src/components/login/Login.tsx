import React, { useState, ChangeEvent, FormEvent } from 'react';
import { loginUser, logout } from '../../services/api';
import './login.scss';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    // const { loginUser, authenticated } = useLoginUser(); // Use the custom hook

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
            const data = await loginUser(email, password, false);
            console.log(data);
        } catch (error: any) {
            console.error('Login error:', error.message);
            setError(error.message);
        }
    };
    const handleLogout = async () => {
        try {
            const response = await logout();
            console.log(response);
            window.location.href = '/'; // Redirect to home or login page after logout
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

        return (
            <div className="login-container">
                <h2>Login to your Account</h2>
                <p>Welcome back! Select method to log in:</p>
                <div className="social-login">
                    <button className="google-login">Google</button>
                    <button className="facebook-login">Facebook</button>
                </div>
                <div className="divider">or continue with email</div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="options">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit" className="login-button">LOG IN</button>
                </form>
                {error && <p className="error">{error}</p>}
                <p className="create-account">
                    Don't have an account? <a href="/register">Create an account</a>
                </p>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        );
};

export default Login;
