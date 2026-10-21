import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI, attendanceAPI } from '../services/api';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import DashboardHome from '../pages/admin/DashboardHome';
import ManageStudents from '../pages/admin/ManageStudents';
import Attendance from '../pages/admin/Attendance';
import StudyMaterial from '../pages/admin/StudyMaterial';
import Holidays from '../pages/admin/Holidays';
import Reports from '../pages/admin/Reports';
import '../styles/admin-dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    <div className="admin-wrapper" data-sidebar-open={sidebarOpen}>
      <AdminHeader
        user={user}
        onThemeToggle={toggleTheme}
        onLogout={handleLogout}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="admin-container">
        <AdminSidebar isOpen={sidebarOpen} />
        
        <main className="admin-main">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="students/*" element={<ManageStudents />} />
            <Route path="attendance/*" element={<Attendance />} />
            <Route path="materials/*" element={<StudyMaterial />} />
            <Route path="holidays/*" element={<Holidays />} />
            <Route path="reports/*" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
