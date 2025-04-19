import React from 'react';
import './Header.css';

const Header = ({ onLogout }) => {
  return (
    <header className="app-header">
      <h1 className="app-title">NeverNote</h1>
      <div className="header-right">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
