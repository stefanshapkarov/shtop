// src/components/Login.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import './login.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your login logic here (e.g., call an API)
    console.log('Email:', email);
    console.log('Password:', password);
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
      <p className="create-account">
        Don't have an account? <a href="/register">Create an account</a>
      </p>
    </div>
  );
};

export default Login;
