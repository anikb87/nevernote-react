// src/routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import App from './App';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<App />} />
    </Routes>
  );
}

export default AppRoutes;
