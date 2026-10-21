import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentHeader from '../components/StudentHeader';
import StudentAttendance from '../pages/student/StudentAttendance';
import StudentMaterials from '../pages/student/StudentMaterials';
import StudentProfile from '../pages/student/StudentProfile';
import '../styles/student-dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="student-wrapper">
      <StudentHeader
        user={user}
        onThemeToggle={toggleTheme}
        onLogout={handleLogout}
      />
      
      <main className="student-main">
        <Routes>
          <Route path="/" element={<StudentAttendance />} />
          <Route path="materials" element={<StudentMaterials />} />
          <Route path="profile" element={<StudentProfile />} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
