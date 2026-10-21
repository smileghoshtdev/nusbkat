# EduTracko React Native - Setup Guide

## 📋 Overview

EduTracko is a **Student Attendance Management System** converted from PHP/HTML to React Native for mobile and web deployment. This guide will help you set up and run the application with **minimal cloud token usage** through intelligent caching and offline-first architecture.

---

## 🎯 Key Features for Minimum Token Usage

1. **Smart Caching System**
   - In-memory cache (5-minute default TTL)
   - AsyncStorage for offline fallback
   - Automatic cache invalidation on data updates

2. **Batch API Requests**
   - Combined data fetching (students, attendance, holidays in one call)
   - Reduced API calls through intelligent request grouping

3. **Offline-First Design**
   - Works without internet connection
   - Automatic sync when connection restored
   - Local data persistence

4. **Token Optimization**
   - Exponential backoff for retries (reduces wasted requests)
   - Network error detection
   - Request deduplication

---

## 📱 Prerequisites

### System Requirements
- **Node.js**: v14 or higher
- **npm** or **yarn**: Package manager
- **Expo CLI**: For development and builds
- **Git**: For version control
- **Android Emulator** or **iOS Simulator** (or real device with Expo Go app)

### Installation of Prerequisites

#### 1. Install Node.js
```bash
# Download from https://nodejs.org/
# Verify installation
node --version
npm --version
```

#### 2. Install Expo CLI
```bash
npm install -g expo-cli

# Verify installation
expo --version
```

#### 3. Install Git
```bash
# Download from https://git-scm.com/
git --version
```

---

## 🚀 Quick Start (5 minutes)

### Step 1: Extract Project
```bash
unzip edutracko-mobile.zip
cd edutracko-mobile
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Configure API URL
Edit `src/services/api.js` and update:
```javascript
const API_BASE_URL = process.env.API_URL || 'http://your-server-ip:port';
```

Or set environment variable:
```bash
# On Windows
set API_URL=http://192.168.1.100:8000

# On macOS/Linux
export API_URL=http://192.168.1.100:8000

# Then start app
npm start
```

### Step 4: Run Application
```bash
npm start

# Press options:
# - Press 'a' for Android Emulator
# - Press 'i' for iOS Simulator
# - Press 'w' for Web
# - Scan QR code with Expo Go app for real device
```

### Step 5: Test Login
```
Username: admin (or any student roll number)
Password: your_password
```

---

## 🔧 Backend Setup (PHP/MySQL)

### Database Configuration
1. Create MySQL database:
```sql
CREATE DATABASE edutracko;
USE edutracko;
-- Import your existing schema
```

2. Update `conn.php`:
```php
$host = 'localhost';      // Your MySQL server
$dbname = 'edutracko';    // Database name
$username = 'root';       // MySQL user
$password = '';           // MySQL password
```

3. Update `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url';
```

### CORS Configuration
Ensure your PHP backend has CORS headers (already included in login.php):
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

---

## 📦 Project Structure

```
edutracko-mobile/
├── App.js                    # Main app entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── src/
│   ├── services/
│   │   └── api.js           # API service with caching
│   ├── context/
│   │   └── AuthContext.js   # Authentication state
│   ├── navigation/
│   │   └── Navigation.js    # App navigation structure
│   └── screens/
│       ├── auth/
│       │   └── LoginScreen.js
│       ├── admin/
│       │   ├── DashboardScreen.js
│       │   ├── AttendanceScreen.js
│       │   ├── StudentManagementScreen.js
│       │   └── AttendanceRegisterScreen.js
│       ├── student/
│       │   ├── DashboardScreen.js
│       │   └── MaterialsScreen.js
│       └── attendance/
│           ├── QRScannerScreen.js
│           └── RFIDScannerScreen.js
└── assets/                  # Images and icons
```

---

## 🔐 Authentication & Security

### Token Management
- Tokens stored in AsyncStorage (encrypted on device)
- Automatic token refresh on session expiry
- Secure logout clears all stored data

### Password Security
- Passwords hashed with bcrypt (backend)
- HTTPS recommended for production
- No sensitive data stored in code

### Offline Security
- Cached data is device-local only
- Clear on logout
- No sync to cloud without authentication

---

## 📊 API Optimization Strategies

### 1. Implement Request Caching
```javascript
// Automatically cached for 5 minutes
const students = await api.getStudents();

// Force refresh
const freshStudents = await api.getStudents(true);
```

### 2. Batch Data Loading
```javascript
// All 3 requests happen in parallel
const [students, attendance, holidays] = await Promise.all([
  api.getStudents(),
  api.getAttendance(),
  api.getHolidays(),
]);
```

### 3. Minimize API Calls
- Use refresh control for manual updates
- Cache navigation between screens
- Avoid redundant requests

### 4. Network Resilience
- Automatic retry with exponential backoff
- Graceful offline fallback
- User-friendly error messages

---

## 🎨 Customization Guide

### Change Colors
Edit screen style files:
```javascript
// Example: src/screens/auth/LoginScreen.js
const COLOR_PRIMARY = '#2196F3';  // Admin blue
const COLOR_SECONDARY = '#4CAF50'; // Student green
```

### Change API Endpoints
Update `src/services/api.js`:
```javascript
async getCustomData() {
  return this.getCachedData(
    'custom_data',
    () => this.axiosInstance.post('/custom-endpoint.php', {})
  );
}
```

### Add New Screens
1. Create screen file in `src/screens/`
2. Import in `src/navigation/Navigation.js`
3. Add route to navigation stack

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:**
```bash
# Check backend is running
# Verify API_URL is correct
# Check firewall allows connection
# Use localhost on same machine or IP address on network
```

### Issue: "Module not found"
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: "Port 8081 is already in use"
**Solution:**
```bash
# Kill process on port 8081
# Windows: netstat -ano | findstr :8081
# macOS/Linux: lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill
```

### Issue: "Camera/Barcode Scanner not working"
**Solution:**
```bash
# Ensure permissions granted in app
# On Android: Settings > Apps > EduTracko > Permissions
# On iOS: Settings > EduTracko > Camera
# Rebuild app if permissions still not working
```

---

## 📈 Deployment Options

### Option 1: Expo Go (Development)
```bash
npm start
# Scan QR code with Expo Go app
```

### Option 2: Build APK (Android)
```bash
# Requires Expo account
expo build:android
```

### Option 3: Build IPA (iOS)
```bash
# Requires Expo account and Apple Developer
expo build:ios
```

### Option 4: Web Deployment
```bash
npm run web
# Deploys to your web server
```

---

## 📊 Monitoring & Performance

### Check API Response Times
Monitor in browser dev tools:
- Network tab shows all API calls
- Cache hits show instant response
- Failed requests show retry logic

### Optimize Performance
1. **Reduce Bundle Size**
   ```bash
   npm run eject  # For advanced optimization
   ```

2. **Monitor API Calls**
   - Use React DevTools
   - Check network tab for cache effectiveness

3. **Battery/Data Usage**
   - Caching reduces data consumption
   - Offline support reduces battery drain

---

## 🔄 Version Control & Updates

### Update Dependencies
```bash
npm update
npm install  # Re-install after package.json changes
```

### Track Changes
```bash
git init
git add .
git commit -m "Initial commit: EduTracko React Native"
```

---

## 📞 Support & Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

### Common Tasks

#### Reset App Data
```javascript
// In code
await api.clearStorage();

// Via CLI
expo@latest doctor
```

#### View Logs
```bash
npm start  # Shows console output
expo@latest logs
```

#### Test API Connection
```bash
# Use curl or Postman
curl -X POST http://your-server/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"pass"}'
```

---

## 🎓 Learning Resources

### React Native Basics
- Components: View, Text, ScrollView
- Hooks: useState, useEffect, useContext
- Navigation: Stack, Tab, Drawer

### State Management
- Context API for auth state
- AsyncStorage for persistence
- Custom hooks for API logic

### Best Practices
- Keep screens lightweight
- Use custom hooks for logic
- Implement proper error handling
- Cache aggressive by default

---

## 📝 Changelog

### Version 1.0.0
- Initial React Native conversion
- Smart caching system
- Offline-first architecture
- QR/RFID scanner integration
- Admin and Student dashboards
- Attendance tracking
- Material management

---

## 📄 License

EduTracko - Student Attendance Management System
© 2024 | All Rights Reserved

---

## 🤝 Contributing

To contribute improvements:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

**Happy coding! 🚀**

For more help, check the inline code comments and the example screens in the project.
