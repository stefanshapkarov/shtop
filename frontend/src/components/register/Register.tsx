import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './register.scss';
import { registerUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Register: React.FC = () => {
  const { t } = useTranslation();
  const [name, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth() as { user: any };
  const navigate = useNavigate();


    useEffect(() => {
      if (user) {
          navigate('/');
      }
    }, [user, navigate]);


  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleTermsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(event.target.checked);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    event.preventDefault();
    if (password.length < 8) {
        setError("The password field must be at least 8 characters.");
        return;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await registerUser(name, email, password, passwordConfirmation);
      setSuccess('Registration successful');
      console.log('Registration successful:', response);
      navigate('/');

    } catch (error) {
      console.error('Registration error:', error);
      setError((error as Error).message);
    }
  };

  return (
    <div className="register-container">
      <h2>{t("CREATE-ACC-1")}</h2>
      <p>{t("UNLOCK-FEATURES")}</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder={t("USERNAME")}
            value={name}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            placeholder={t("EMAIL")}
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder={t("PASSWORD")}
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder={t("CONFIRM-PASSWORD")}
            value={passwordConfirmation}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={handleTermsChange}
              required
            />
            {t("ACCEPT-TERMS")}<a href="#"></a>
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" className="register-button">{t("REGISTER")}</button>
      </form>
      <p className="login-account">
        {t("HAVE-ACC")} <a href="/login">{t("LOGIN-NOW")}</a>
      </p>
    </div>
  );
};

export default Register;