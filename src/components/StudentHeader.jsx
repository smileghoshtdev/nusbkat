import React from 'react';

const StudentHeader = ({ user, onThemeToggle, onLogout }) => (
  <header className="student-header">
    <div className="header-content">
      <h1>Edu Track Pro - Student Portal</h1>
      <button onClick={onThemeToggle} className="theme-btn">
        <i className="fas fa-moon"></i>
      </button>
      <button onClick={onLogout} className="btn btn-danger btn-sm">
        Logout
      </button>
    </div>
  </header>
);

export default StudentHeader;
