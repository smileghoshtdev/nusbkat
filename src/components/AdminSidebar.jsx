import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: 'fas fa-th-large', path: '/admin' },
    { label: 'Manage Students', icon: 'fas fa-user-graduate', path: '/admin/students' },
    { label: 'Attendance', icon: 'fas fa-qrcode', path: '/admin/attendance' },
    { label: 'Study Material', icon: 'fas fa-book-open', path: '/admin/materials' },
    { label: 'Holidays', icon: 'fas fa-umbrella-beach', path: '/admin/holidays' },
    { label: 'Reports', icon: 'fas fa-chart-pie', path: '/admin/reports' },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
