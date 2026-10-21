import React, { useState, useEffect } from 'react';
import { studentAPI, attendanceAPI } from '../../services/api';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAttendance: 0,
    presentToday: 0,
    absentToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [studentsRes, attendanceRes] = await Promise.all([
          studentAPI.fetchAll(),
          attendanceAPI.fetchAll(),
        ]);

        if (studentsRes.success && attendanceRes.success) {
          setStats({
            totalStudents: studentsRes.data.length,
            totalAttendance: attendanceRes.data.length,
            presentToday: attendanceRes.data.filter(
              (r) => r.Type === 'IN'
            ).length,
            absentToday: studentsRes.data.length - 
              attendanceRes.data.filter((r) => r.Type === 'IN').length,
          });
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>Total Students</h3>
            <p className="stat-number">{stats.totalStudents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon present">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Present Today</h3>
            <p className="stat-number">{stats.presentToday}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon absent">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Absent Today</h3>
            <p className="stat-number">{stats.absentToday}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon attendance">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>Total Records</h3>
            <p className="stat-number">{stats.totalAttendance}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="btn btn-solid">Mark Attendance</button>
            <button className="btn btn-outline">Add Student</button>
            <button className="btn btn-outline">View Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
