import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './components/App/App';
import LoginPage from './components/LoginPage/LoginPage';
import './index.css'; // Optional: global styles, if needed

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notes" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
