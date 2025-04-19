// src/components/LoginPage/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api";
import "./LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Login button clicked");

    if (!username || !password) {
      console.warn("Username or password missing");
      return;
    }

    try {
      const response = await loginUser(username, password);
      console.log("Login success:", response);
      localStorage.setItem("token", response.token);
      navigate("/app");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to NeverNote</h2>
      <input
        type="text"
        placeholder="Username"
        className="login-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
