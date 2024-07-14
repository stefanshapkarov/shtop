// src/components/Register.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import './register.scss';
import { registerUser } from '../../services/api';

const Register: React.FC = () => {
  const [name, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setConfirmPassword] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await registerUser(name, email, password, passwordConfirmation);
      setSuccess('Registration successful');
      console.log('Registration successful:', response);

      // Handle redirect after registration
      window.location.href = '/home'; // Or whatever your redirect URL is

    } catch (error) {
      console.error('Registration error:', error);
      setError((error as Error).message);
    }
  };

  return (
    <div className="register-container">
      <h2>Create your account</h2>
      <p>Unlock all Features!</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={handleUsernameChange}
            required
          />
        </div>
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
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
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
            Accept <a href="#">terms and conditions</a>
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" className="register-button">Register</button>
      </form>
      <p className="login-account">
        You have an account? <a href="/login">Login now</a>
      </p>
    </div>
  );
};

export default Register;