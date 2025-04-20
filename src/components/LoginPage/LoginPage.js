// src/components/LoginPage/LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        alert('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-page">
      <h2 className="login-title">NeverNote</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        className="login-input"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="login-input"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default LoginPage;
