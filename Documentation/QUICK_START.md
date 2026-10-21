# EduTracko React Native - Quick Start

## ⚡ 5-Minute Setup

### Step 1: Prepare
```bash
# Extract zip file
unzip edutracko-mobile.zip
cd edutracko-mobile

# Install npm packages
npm install
```

### Step 2: Configure
Edit `src/services/api.js` - Line 5:
```javascript
const API_BASE_URL = 'http://192.168.1.100:8000';  // Your backend URL
```

### Step 3: Run
```bash
npm start
```

Then:
- **Android**: Press `a`
- **iOS**: Press `i`
- **Web**: Press `w`
- **Real Device**: Scan QR code with Expo Go app

### Step 4: Login
```
Username: admin (or student roll number)
Password: your_database_password
```

---

## 📱 For Real Android Device

1. Install **Expo Go** from Google Play Store
2. Run `npm start`
3. Scan QR code with Expo Go app
4. Done! App loads on your phone

---

## 🖥️ Backend Requirements

Your PHP backend needs:
- `login.php` - Authentication
- `fetch-student.php` - Get students
- `fetch-attendance.php` - Get attendance
- `mark-attendance.php` - Mark attendance
- `qr-checkin.php` - QR scanning
- `fetch-holidays.php` - Get holidays
- `fetch-materials.php` - Get materials

All files already have CORS support ✓

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot reach server | Update API_URL to correct IP/port |
| Module not found | Run `npm install` again |
| Port in use | Change port in `npm start` options |
| Camera not working | Grant permissions in device settings |
| Login fails | Check database connection on backend |

---

## 📦 Included Features

✅ Admin Dashboard with statistics
✅ Student Dashboard with attendance
✅ QR Code Scanner
✅ RFID Scanner (placeholder)
✅ Role-based access (admin/student)
✅ Offline data caching
✅ Auto-retry with backoff
✅ Responsive design

---

## 🚀 Next Steps

1. **Customize colors** → Edit screen styles
2. **Add screens** → Copy existing screen template
3. **Deploy** → Follow deployment guide
4. **Optimize** → Monitor cache effectiveness

---

## 📞 Quick Links

- [Full Setup Guide](./SETUP_GUIDE.md)
- [API Documentation](./API_CONFIG.md)
- [File Structure](./PROJECT_STRUCTURE.md)

---

**Everything ready? Run `npm start` and enjoy! 🎉**
