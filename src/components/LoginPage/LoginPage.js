// src/components/LoginPage/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const isLocal = window.location.hostname === "localhost";
const API_BASE_URL = isLocal
  ? "http://localhost:3000"
  : "https://nevernote-express.onrender.com";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Login button clicked");
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login success:", data);

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token); // ✅ Save token to localStorage
        navigate('/'); // redirect to app
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to NeverNote</h2>
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
