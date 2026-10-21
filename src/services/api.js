import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://your-server.com';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

class APIService {
  constructor() {
    this.cacheStore = new Map();
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  }

  /**
   * Get cached data or fetch from server
   */
  async getCachedData(key, fetchFn, options = {}) {
    const { forceRefresh = false, cacheDuration = CACHE_DURATION } = options;

    // Check in-memory cache first
    if (!forceRefresh && this.cacheStore.has(key)) {
      const cached = this.cacheStore.get(key);
      if (Date.now() - cached.timestamp < cacheDuration) {
        return cached.data;
      }
    }

    try {
      const data = await fetchFn();
      this.cacheStore.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      // Try to get from AsyncStorage as fallback
      const storageData = await this.getFromStorage(key);
      if (storageData) {
        return storageData;
      }
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(username, password) {
    try {
      const response = await this.retryRequest(() =>
        this.axiosInstance.post('/login.php', {
          username,
          password,
        })
      );

      if (response.data.success) {
        const userData = response.data.data;
        await this.saveToStorage('userData', userData);
        await this.saveToStorage('userToken', userData.id);
        return userData;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw this.handleError(error, 'Login failed');
    }
  }

  /**
   * Fetch students with caching
   */
  async getStudents(forceRefresh = false) {
    return this.getCachedData(
      'students',
      () => this.axiosInstance.post('/fetch-student.php', {}),
      { forceRefresh }
    ).then(res => res.data.data || []);
  }

  /**
   * Fetch attendance with caching
   */
  async getAttendance(forceRefresh = false) {
    return this.getCachedData(
      'attendance',
      () => this.axiosInstance.post('/fetch-attendance.php', {}),
      { forceRefresh }
    ).then(res => res.data.data || []);
  }

  /**
   * Mark attendance
   */
  async markAttendance(data) {
    try {
      const response = await this.retryRequest(() =>
        this.axiosInstance.post('/mark-attendance.php', data)
      );

      if (response.data.success) {
        // Invalidate cache after marking attendance
        this.cacheStore.delete('attendance');
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw this.handleError(error, 'Failed to mark attendance');
    }
  }

  /**
   * QR Code Check-in
   */
  async qrCheckin(data) {
    try {
      const response = await this.retryRequest(() =>
        this.axiosInstance.post('/qr-checkin.php', data)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'QR check-in failed');
    }
  }

  /**
   * RFID Check-in
   */
  async rfidCheckin(data) {
    try {
      const response = await this.retryRequest(() =>
        this.axiosInstance.post('/rfid-checkin.php', data)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'RFID check-in failed');
    }
  }

  /**
   * Get holidays
   */
  async getHolidays(forceRefresh = false) {
    return this.getCachedData(
      'holidays',
      () => this.axiosInstance.post('/fetch-holidays.php', {}),
      { forceRefresh }
    ).then(res => res.data.data || []);
  }

  /**
   * Get materials
   */
  async getMaterials(forceRefresh = false) {
    return this.getCachedData(
      'materials',
      () => this.axiosInstance.post('/fetch-materials.php', {}),
      { forceRefresh }
    ).then(res => res.data.data || []);
  }

  /**
   * Retry logic for network resilience
   */
  async retryRequest(requestFn, attempts = RETRY_ATTEMPTS) {
    let lastError;

    for (let i = 0; i < attempts; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (i < attempts - 1) {
          await this.delay(RETRY_DELAY * Math.pow(2, i)); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  /**
   * AsyncStorage helpers
   */
  async saveToStorage(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to save ${key} to storage:`, error);
    }
  }

  async getFromStorage(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`Failed to get ${key} from storage:`, error);
      return null;
    }
  }

  async clearStorage() {
    try {
      await AsyncStorage.clear();
      this.cacheStore.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  /**
   * Error handling
   */
  handleError(error, defaultMessage) {
    if (error.response) {
      return new Error(error.response.data?.message || defaultMessage);
    } else if (error.request) {
      return new Error('Network error - no response from server');
    } else {
      return new Error(error.message || defaultMessage);
    }
  }

  /**
   * Utility delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Set API URL
   */
  setAPIUrl(url) {
    this.axiosInstance.defaults.baseURL = url;
  }

  /**
   * Set authorization token
   */
  setAuthToken(token) {
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }
}

export default new APIService();
