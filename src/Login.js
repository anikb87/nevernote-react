import React, { useState } from 'react';
import './App.css';
import { loginUser } from './api';
import './Login.css';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) return;
    try {
      const { token } = await loginUser(username, password);
      localStorage.setItem('token', token);
      setToken(token);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login to NeverNote</h2>
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="login-error">{error}</p>}
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
