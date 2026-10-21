import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://nusbk.online/API';

// Create axios instance with config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (username, password) =>
    apiClient.post('/login.php', { username, password }),
  
  changePassword: (oldPassword, newPassword) =>
    apiClient.post('/change-password.php', { oldPassword, newPassword }),
};

// Student APIs
export const studentAPI = {
  fetchAll: () => apiClient.get('/fetch-student.php'),
  
  fetchOne: (roll) => apiClient.get('/fetch-student.php', { params: { roll } }),
  
  add: (studentData) => apiClient.post('/add-student.php', studentData),
  
  update: (roll, studentData) =>
    apiClient.post('/update-student.php', { roll, ...studentData }),
  
  delete: (roll) => apiClient.post('/delete-student.php', { roll }),
  
  bulkAdd: (studentsData) =>
    apiClient.post('/bulk-add-student.php', { students: studentsData }),
};

// Attendance APIs
export const attendanceAPI = {
  fetchAll: () => apiClient.get('/fetch-attendance.php'),
  
  fetchRegister: (date, className) =>
    apiClient.get('/fetch-attendance-register.php', {
      params: { date, class: className },
    }),
  
  mark: (attendanceData) => apiClient.post('/mark-attendance.php', attendanceData),
  
  qrCheckin: (qrData) => apiClient.post('/qr-checkin.php', { qrData }),
  
  rfidCheckin: (rfidData) => apiClient.post('/rfid-checkin.php', { rfidData }),
};

// Holiday APIs
export const holidayAPI = {
  fetchAll: () => apiClient.get('/fetch-holidays.php'),
  
  add: (holidayData) => apiClient.post('/add-holiday.php', holidayData),
  
  delete: (holidayId) => apiClient.post('/delete-holiday.php', { id: holidayId }),
  
  manage: (holidaysData) =>
    apiClient.post('/manage-holidays.php', { holidays: holidaysData }),
};

// Material APIs
export const materialAPI = {
  fetchAll: () => apiClient.get('/fetch-materials.php'),
  
  add: (materialData) => apiClient.post('/add-material.php', materialData),
  
  delete: (materialId) => apiClient.post('/delete-material.php', { id: materialId }),
};

// Subject APIs
export const subjectAPI = {
  fetchAll: () => apiClient.get('/fetch-subjects.php'),
  
  add: (subjectData) => apiClient.post('/add-subject.php', subjectData),
  
  delete: (subjectId) => apiClient.post('/delete-subject.php', { id: subjectId }),
};

// Class APIs
export const classAPI = {
  fetchAll: () => apiClient.get('/fetch-classes.php'),
};

// User APIs
export const userAPI = {
  fetchAll: () => apiClient.get('/fetch-users.php'),
};

// Cache helper - minimize API calls
export const cacheAPI = {
  cache: {},
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  
  get(key) {
    const cached = this.cache[key];
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }
    return null;
  },
  
  set(key, data) {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  },
  
  clear(key) {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  },
};

export default apiClient;
