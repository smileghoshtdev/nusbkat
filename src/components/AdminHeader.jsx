import React, { useState } from 'react';

const AdminHeader = ({ user, onThemeToggle, onLogout, onMenuToggle }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="app-title">
          <h1>Edu Track Pro</h1>
          <span>Admin Dashboard</span>
        </div>
      </div>

      <div className="header-right">
        <button className="theme-toggle" onClick={onThemeToggle}>
          <i className="fas fa-moon"></i>
        </button>

        <button className="notification-bell">
          <i className="fas fa-bell"></i>
          <span className="badge">0</span>
        </button>

        <div className="profile-menu">
          <button
            className="profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="avatar">{user?.username?.charAt(0).toUpperCase()}</div>
            <span>{user?.username}</span>
            <i className="fas fa-chevron-down"></i>
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <i className="fas fa-user"></i>
                <span>Profile</span>
              </div>
              <div className="dropdown-item">
                <i className="fas fa-key"></i>
                <span>Change Password</span>
              </div>
              <hr />
              <div className="dropdown-item danger" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
