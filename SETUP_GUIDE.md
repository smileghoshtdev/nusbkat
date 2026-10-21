# Edu Track Pro - React Version
## Complete Setup & Installation Guide

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Database Setup](#database-setup)
4. [Backend (PHP) Setup](#backend-php-setup)
5. [Frontend (React) Setup](#frontend-react-setup)
6. [Running the Application](#running-the-application)
7. [API Endpoints](#api-endpoints)
8. [Optimization Tips](#optimization-tips)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Edu Track Pro** is an educational attendance management system with:

### Features
- ✅ User Authentication (Admin & Student)
- ✅ Attendance Management (Manual, RFID, QR Code)
- ✅ Student Management (CRUD Operations)
- ✅ Holiday Management
- ✅ Study Material Distribution
- ✅ Attendance Reports & Analytics
- ✅ Dark/Light Theme Support
- ✅ Responsive Design

### Tech Stack
- **Frontend:** React 18, React Router v6, Axios
- **Backend:** PHP (RESTful API)
- **Database:** MySQL
- **State Management:** React Context API
- **Styling:** CSS3 with CSS Variables
- **Charting:** Chart.js with React Charts

---

## 💻 System Requirements

### Minimum Requirements
- **Node.js:** v14.0.0 or higher
- **PHP:** v7.4 or higher
- **MySQL:** v5.7 or higher
- **RAM:** 4GB minimum
- **Disk Space:** 500MB for development

### Recommended
- **Node.js:** v16.x or v18.x (LTS)
- **PHP:** v8.0 or higher
- **MySQL:** v8.0 or higher
- **RAM:** 8GB
- **SSD:** For better performance

---

## 🗄️ Database Setup

### Step 1: Create Database

```bash
mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS edutracko;
USE edutracko;

-- Users table (Admin accounts)
CREATE TABLE users (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  UID VARCHAR(100) UNIQUE NOT NULL,
  Name VARCHAR(100) NOT NULL,
  Roll VARCHAR(50) NOT NULL UNIQUE,
  Class VARCHAR(20) NOT NULL,
  Address TEXT,
  password VARCHAR(255) NOT NULL,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE attendance (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  UID VARCHAR(100),
  Date DATE NOT NULL,
  Time TIME NOT NULL,
  Type ENUM('IN', 'OUT') NOT NULL,
  Method ENUM('MANUAL', 'RFID', 'QR') DEFAULT 'MANUAL',
  FOREIGN KEY (UID) REFERENCES students(UID),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_uid_date (UID, Date)
);

-- Holidays table
CREATE TABLE holidays (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Date DATE NOT NULL UNIQUE,
  Reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study Materials table
CREATE TABLE materials (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  Title VARCHAR(150) NOT NULL,
  Class VARCHAR(20) NOT NULL,
  Subject VARCHAR(50),
  Description TEXT,
  File_URL VARCHAR(255),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  SubjectName VARCHAR(100) NOT NULL,
  Class VARCHAR(20) NOT NULL,
  UNIQUE KEY unique_subject_class (SubjectName, Class)
);

-- Classes table
CREATE TABLE classes (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  ClassName VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for optimization
CREATE INDEX idx_attendance_date ON attendance(Date);
CREATE INDEX idx_attendance_uid ON attendance(UID);
CREATE INDEX idx_students_class ON students(Class);
CREATE INDEX idx_students_roll ON students(Roll);
CREATE INDEX idx_users_username ON users(username);
```

### Step 2: Insert Sample Data

```sql
-- Add sample admin user (password: admin123)
INSERT INTO users (username, password) 
VALUES ('admin', '$2y$10$YWJjZGVmZ2hpamtsbW5vcA==');

-- Add sample student (password: student123)
INSERT INTO students (UID, Name, Roll, Class, Address, password) 
VALUES ('STU001', 'John Doe', '001', 'X-A', '123 Main St', '$2y$10$YWJjZGVmZ2hpamtsbW5vcA==');

-- Add sample classes
INSERT INTO classes (ClassName) VALUES ('X-A'), ('X-B'), ('XI-A'), ('XI-B'), ('XII-A'), ('XII-B');

-- Add sample subjects
INSERT INTO subjects (SubjectName, Class) VALUES 
('Mathematics', 'X-A'),
('English', 'X-A'),
('Science', 'X-A'),
('Social Studies', 'X-A');
```

---

## 🔧 Backend (PHP) Setup

### Step 1: Create Backend Directory Structure

```
backend/
├── api/
│   ├── login.php
│   ├── logout.php
│   ├── change-password.php
│   ├── fetch-student.php
│   ├── add-student.php
│   ├── update-student.php
│   ├── delete-student.php
│   ├── bulk-add-student.php
│   ├── fetch-attendance.php
│   ├── mark-attendance.php
│   ├── fetch-attendance-register.php
│   ├── qr-checkin.php
│   ├── rfid-checkin.php
│   ├── fetch-holidays.php
│   ├── add-holiday.php
│   ├── delete-holiday.php
│   ├── manage-holidays.php
│   ├── fetch-materials.php
│   ├── add-material.php
│   ├── delete-material.php
│   ├── fetch-subjects.php
│   ├── add-subject.php
│   ├── delete-subject.php
│   ├── fetch-classes.php
│   ├── fetch-users.php
│   ├── conn.php
│   └── cors.php
├── .htaccess
└── index.php
```

### Step 2: CORS Configuration

Create `.htaccess` in backend root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /api/

  # Add CORS headers
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
  Header set Access-Control-Allow-Headers "Content-Type, Authorization"

  # Handle preflight requests
  RewriteCond %{REQUEST_METHOD} OPTIONS
  RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>
```

### Step 3: Database Connection (conn.php)

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Database configuration
$host = 'localhost';
$dbname = 'edutracko';
$username = 'root';
$password = '';
$port = 3306;

try {
    $conn = new mysqli($host, $username, $password, $dbname, $port);
    
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    
    $conn->set_charset('utf8mb4');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    exit;
}
?>
```

### Step 4: Copy PHP Files from Project

Copy all PHP files from `/mnt/project/*.php` to your `backend/api/` directory.

---

## ⚛️ Frontend (React) Setup

### Step 1: Install Node Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# or using yarn
yarn install
```

### Step 2: Environment Configuration

Create `.env` file in frontend root:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_API_TIMEOUT=10000
```

**For Production:**

```env
REACT_APP_API_BASE_URL=https://yourdomain.com/api
REACT_APP_API_TIMEOUT=15000
```

### Step 3: Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── StudentHeader.jsx
│   │   └── ... (other components)
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── admin/
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── ManageStudents.jsx
│   │   │   ├── Attendance.jsx
│   │   │   └── ... (other admin pages)
│   │   └── student/
│   │       ├── StudentAttendance.jsx
│   │       ├── StudentMaterials.jsx
│   │       └── StudentProfile.jsx
│   ├── services/
│   │   └── api.js (API service layer)
│   ├── context/
│   │   └── AuthContext.js (State management)
│   ├── styles/
│   │   ├── login.css
│   │   ├── admin-dashboard.css
│   │   ├── student-dashboard.css
│   │   └── global.css
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
├── .env
└── .env.example
```

---

## 🚀 Running the Application

### Option 1: Local Development

**Terminal 1 - Start React Frontend:**

```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

**Terminal 2 - Start PHP Backend:**

```bash
cd backend
# Using PHP built-in server
php -S localhost:8000

# OR using Apache/Nginx (configure accordingly)
```

**Terminal 3 - MySQL Server:**

```bash
# Ensure MySQL is running
# Windows: Services → MySQL → Start
# macOS: brew services start mysql
# Linux: sudo service mysql start
```

### Option 2: Docker Setup (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: edutracko
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  php:
    image: php:8.0-apache
    depends_on:
      - mysql
    ports:
      - "8000:80"
    volumes:
      - ./backend:/var/www/html
    environment:
      MYSQL_HOST: mysql
      MYSQL_DB: edutracko
      MYSQL_USER: root
      MYSQL_PASSWORD: root

  react:
    image: node:16
    working_dir: /app
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    command: npm start
    environment:
      - REACT_APP_API_BASE_URL=http://localhost:8000/api

volumes:
  mysql_data:
```

Run with: `docker-compose up -d`

---

## 📡 API Endpoints

### Authentication
- `POST /api/login.php` - User login
- `POST /api/logout.php` - User logout
- `POST /api/change-password.php` - Change password

### Students
- `GET /api/fetch-student.php` - Get all students or single student
- `POST /api/add-student.php` - Add new student
- `POST /api/update-student.php` - Update student
- `POST /api/delete-student.php` - Delete student
- `POST /api/bulk-add-student.php` - Bulk add students

### Attendance
- `GET /api/fetch-attendance.php` - Get attendance records
- `GET /api/fetch-attendance-register.php` - Get attendance register
- `POST /api/mark-attendance.php` - Mark attendance
- `POST /api/qr-checkin.php` - QR code check-in
- `POST /api/rfid-checkin.php` - RFID check-in

### Materials
- `GET /api/fetch-materials.php` - Get study materials
- `POST /api/add-material.php` - Add material
- `POST /api/delete-material.php` - Delete material

### Holidays
- `GET /api/fetch-holidays.php` - Get holidays
- `POST /api/add-holiday.php` - Add holiday
- `POST /api/delete-holiday.php` - Delete holiday

### Classes & Subjects
- `GET /api/fetch-classes.php` - Get all classes
- `GET /api/fetch-subjects.php` - Get subjects
- `POST /api/add-subject.php` - Add subject
- `POST /api/delete-subject.php` - Delete subject

---

## ⚡ Optimization Tips for Minimum Token Usage

### 1. **API Caching**
The system includes built-in caching:

```javascript
import { cacheAPI } from './services/api';

// Get cached data
const data = cacheAPI.get('students');

// Set cache
cacheAPI.set('students', studentsData);

// Clear cache
cacheAPI.clear('students'); // Clear specific key
cacheAPI.clear(); // Clear all
```

### 2. **Batch Requests**
Use bulk operations for multiple operations:

```javascript
// Instead of multiple add requests
studentAPI.bulkAdd(studentsArray);
```

### 3. **Pagination**
Implement pagination for large datasets:

```javascript
const fetchStudents = async (page = 1, limit = 20) => {
  return studentAPI.fetchAll({ page, limit });
};
```

### 4. **Lazy Loading**
Load components only when needed:

```javascript
const Reports = lazy(() => import('./pages/admin/Reports'));
```

### 5. **Debouncing Search**
Reduce API calls during search:

```javascript
import { useEffect, useRef } from 'react';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
```

### 6. **Token-Based Authentication**
Reduces server-side processing:

```javascript
// Login stores token
localStorage.setItem('authToken', token);

// Token auto-added to all requests via axios interceptor
```

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution:** Ensure `conn.php` has proper headers:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### Issue: Database Connection Failed

**Solution:** Check credentials in `conn.php`:

```bash
# Test MySQL connection
mysql -h localhost -u root -p edutracko
```

### Issue: Blank Page on Login

**Solution:** Check browser console for errors:

```javascript
// Enable debug mode
localStorage.setItem('debug', 'true');
```

### Issue: Slow API Responses

**Solution:** 
1. Add database indexes
2. Implement pagination
3. Use caching
4. Compress responses (gzip)

### Issue: React Port Already in Use

**Solution:**

```bash
# Change port
PORT=3001 npm start

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: PHP Extensions Missing

**Solution:**

```bash
# Required extensions
php -m | grep -E 'mysqli|json|gd'

# Install missing extensions (Ubuntu/Debian)
sudo apt-get install php-mysqli php-json php-gd
```

---

## 📝 Default Credentials

| User | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Student | `001` | `student123` |

⚠️ **Important:** Change these passwords after first login!

---

## 🔒 Security Best Practices

1. **Change Default Passwords** - Always change default credentials
2. **Use HTTPS** - Deploy with SSL/TLS in production
3. **Validate Input** - Both frontend and backend
4. **Use Prepared Statements** - Prevent SQL injection
5. **Implement Rate Limiting** - Prevent brute force attacks
6. **Use Environment Variables** - Don't hardcode sensitive data
7. **Keep Dependencies Updated** - Regular security patches

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review error logs in browser console
3. Check MySQL logs: `tail -f /var/log/mysql/error.log`
4. Check PHP logs: `tail -f /var/log/php-errors.log`

---

## 📄 License

This project is provided as-is for educational purposes.

---

**Last Updated:** October 2024
**Version:** 1.0.0
