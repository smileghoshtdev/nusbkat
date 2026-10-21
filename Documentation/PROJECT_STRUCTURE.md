# Project Structure Guide

## 📁 Complete File Organization

```
edutracko-mobile/
│
├── 📄 App.js                              # Main app entry point
├── 📄 app.json                            # Expo app configuration
├── 📄 babel.config.js                     # Babel configuration
├── 📄 package.json                        # Dependencies & scripts
├── 📄 package-lock.json                   # Dependency lock file
├── 📄 .gitignore                          # Git ignore rules
├── 📄 .env.example                        # Environment template
│
├── 📚 Documentation (Read These!)
│   ├── 📄 README.md                       # Project overview
│   ├── 📄 QUICK_START.md                  # 5-minute setup
│   ├── 📄 SETUP_GUIDE.md                  # Complete guide
│   ├── 📄 API_CONFIG.md                   # API endpoints
│   └── 📄 PROJECT_STRUCTURE.md            # This file
│
├── 📁 src/
│   │
│   ├── 🔑 context/
│   │   └── AuthContext.js                 # Authentication context
│   │                                       # Provides: signIn, signOut, state
│   │                                       # Size: ~2.5 KB
│   │
│   ├── 🌐 services/
│   │   └── api.js                         # API service with caching
│   │                                       # Features:
│   │                                       # - Smart caching (5min TTL)
│   │                                       # - Retry logic (3 attempts)
│   │                                       # - AsyncStorage fallback
│   │                                       # - Batch loading
│   │                                       # Size: ~8 KB
│   │
│   ├── 🗺️ navigation/
│   │   └── Navigation.js                  # App navigation structure
│   │                                       # Handles:
│   │                                       # - Auth stack (login)
│   │                                       # - Admin stack (tabs + screens)
│   │                                       # - Student stack (tabs + screens)
│   │                                       # Size: ~5 KB
│   │
│   └── 📺 screens/
│       │
│       ├── 🔐 auth/
│       │   └── LoginScreen.js             # Login page
│       │                                   # Size: ~3.5 KB
│       │
│       ├── 👨‍💼 admin/
│       │   ├── DashboardScreen.js         # Admin dashboard
│       │   │                               # Shows: stats, quick actions
│       │   │                               # Size: ~4 KB
│       │   ├── AttendanceScreen.js        # Mark attendance
│       │   │                               # Size: ~2 KB (placeholder)
│       │   ├── StudentManagementScreen.js # Manage students
│       │   │                               # Size: ~2 KB (placeholder)
│       │   └── AttendanceRegisterScreen.js# View registers
│       │                                   # Size: ~2 KB (placeholder)
│       │
│       ├── 👨‍🎓 student/
│       │   ├── DashboardScreen.js         # Student attendance view
│       │   │                               # Shows: attendance %, history
│       │   │                               # Size: ~4 KB
│       │   └── MaterialsScreen.js         # Study materials
│       │                                   # Size: ~2 KB (placeholder)
│       │
│       ├── 📱 attendance/
│       │   ├── QRScannerScreen.js         # QR code scanner
│       │   │                               # Uses: expo-barcode-scanner
│       │   │                               # Size: ~2.5 KB
│       │   ├── RFIDScannerScreen.js       # RFID scanner
│       │   │                               # Size: ~1.5 KB (placeholder)
│       │   └── PlaceholderScreens.js      # Placeholder screens
│       │                                   # Exported: RFID, Attendance,
│       │                                   #           Students, Register,
│       │                                   #           Materials
│       │                                   # Size: ~2 KB
│       │
│       └── [Additional screens as needed]
│
└── 📁 assets/ (Create these)
    ├── icon.png                           # App icon (1024x1024)
    ├── splash.png                         # Splash screen
    ├── adaptive-icon.png                  # Android adaptive icon
    ├── favicon.png                        # Web favicon
    └── login-bg.png                       # Login background (optional)
```

---

## 📊 File Size Summary

| File | Size | Purpose |
|------|------|---------|
| api.js | 8 KB | API layer with caching |
| AuthContext.js | 2.5 KB | Auth state |
| Navigation.js | 5 KB | Navigation setup |
| LoginScreen.js | 3.5 KB | Login UI |
| AdminDashboard.js | 4 KB | Admin panel |
| StudentDashboard.js | 4 KB | Student panel |
| QRScanner.js | 2.5 KB | QR scanning |
| Placeholders | 2 KB | Stub screens |
| **Total JS** | **~31 KB** | Application code |
| node_modules | ~150 MB | Dependencies |
| **Packaged** | ~3 MB | With compression |

---

## 🔄 Data Flow

```
User Input (LoginScreen)
    ↓
AuthContext.signIn()
    ↓
api.login(username, password)
    ↓
POST /login.php
    ↓
Validate & Hash Password (Backend)
    ↓
Return User Data + Token
    ↓
Save to AsyncStorage
    ↓
Navigate to Dashboard
    ↓
Dashboard queries cached data:
├─→ api.getStudents()
├─→ api.getAttendance()
└─→ api.getHolidays()
    ↓
Cache Check (Valid?)
    ├─→ Yes: Return cached
    └─→ No: Fetch fresh + Cache
    ↓
Display Statistics
```

---

## 🔗 Component Relationships

```
App.js (Root)
  ↓
AuthProvider (Context)
  ├─→ AuthContext (state, methods)
  │
RootNavigator (Navigation)
  ├─→ AuthStack
  │   └─→ LoginScreen
  │       └─→ Uses: AuthContext.signIn()
  │
  ├─→ AdminStack
  │   ├─→ AdminTabs (Bottom tabs)
  │   │   ├─→ DashboardScreen
  │   │   ├─→ AttendanceScreen
  │   │   ├─→ StudentManagementScreen
  │   │   └─→ AttendanceRegisterScreen
  │   │
  │   └─→ Modal Screens
  │       ├─→ QRScannerScreen
  │       └─→ RFIDScannerScreen
  │
  └─→ StudentStack
      └─→ StudentTabs (Bottom tabs)
          ├─→ DashboardScreen
          └─→ MaterialsScreen

All Screens
  ↓
api.js (Service)
  ├─→ login()
  ├─→ getStudents()
  ├─→ getAttendance()
  ├─→ markAttendance()
  ├─→ qrCheckin()
  ├─→ getHolidays()
  └─→ getMaterials()
```

---

## 📝 Important Files

### Core Files (MUST MODIFY)
1. **src/services/api.js** - Line 5
   - Update `API_BASE_URL` to your backend

### Configuration Files
1. **app.json** - App metadata
2. **package.json** - Dependencies & scripts
3. **.env** - Environment variables (create from .env.example)

### Documentation (READ FIRST)
1. **README.md** - Project overview
2. **QUICK_START.md** - 5-minute setup
3. **SETUP_GUIDE.md** - Complete instructions
4. **API_CONFIG.md** - Backend integration

---

## 🎨 Screen Components

### Admin Screens
- **DashboardScreen**: 4 stat cards + quick action buttons
- **AttendanceScreen**: Mark attendance form
- **StudentManagementScreen**: Student list & crud operations
- **AttendanceRegisterScreen**: View attendance history

### Student Screens
- **DashboardScreen**: 3 stat cards + attendance history
- **MaterialsScreen**: Download study materials

### Shared Features
- Bottom tab navigation
- Header with logout button
- Pull-to-refresh
- Error alerts
- Loading indicators

---

## 🔄 API Integration Points

### Screens calling API.js

```
LoginScreen
  └─→ api.login()

AdminDashboard
  ├─→ api.getStudents()
  ├─→ api.getAttendance()
  └─→ api.getHolidays()

AttendanceScreen
  └─→ api.markAttendance()

QRScannerScreen
  └─→ api.qrCheckin()

StudentDashboard
  └─→ api.getAttendance()

MaterialsScreen
  └─→ api.getMaterials()
```

---

## 📦 Dependencies

### Core
- **react** - UI framework
- **react-native** - Mobile framework
- **expo** - Development platform

### Navigation
- **react-navigation** - Routing
- **react-navigation-native** - Native routing
- **react-navigation-bottom-tabs** - Bottom tabs
- **react-navigation-stack** - Stack navigation

### API & Storage
- **axios** - HTTP client
- **async-storage** - Local storage
- **@react-native-async-storage/async-storage** - AsyncStorage

### Camera & Scanning
- **expo-camera** - Camera access
- **expo-barcode-scanner** - QR/Barcode scanning

### UI & Icons
- **react-native-vector-icons** - Icon library
- **react-native-gesture-handler** - Gesture support
- **react-native-reanimated** - Animations
- **react-native-modal** - Modal dialogs

### Utilities
- **moment** - Date/time formatting

---

## 🚀 Build & Deploy Files

### Development
- `package.json` - Defines build scripts
- `babel.config.js` - JavaScript transpilation
- `app.json` - App metadata

### Build Output
- Android: `.apk` or `.aab` file
- iOS: `.ipa` file
- Web: `web-build/` directory

---

## 🔐 Security Considerations

### Files NOT to commit
- `.env` - Contains secrets
- `node_modules/` - Dependency directory
- `.expo/` - Build cache
- `*.log` - Log files

### Safe to commit
- Source code (src/)
- Configuration (app.json, babel.config.js)
- Documentation
- .gitignore

---

## 📈 Performance Files

### Caching Logic
**File:** `src/services/api.js`
- Lines 15-32: In-memory cache check
- Lines 35-45: API fetch with cache save
- Lines 48-60: Fallback to AsyncStorage

### Retry Logic
**File:** `src/services/api.js`
- Lines 141-158: Exponential backoff retry
- Default: 3 attempts with 1s, 2s, 4s delays

### State Management
**File:** `src/context/AuthContext.js`
- Bootstrap async (useEffect)
- Token restoration
- Persistent auth

---

## 🛠️ Extending the App

### Add New Screen
1. Create: `src/screens/feature/NewScreen.js`
2. Import: In `Navigation.js`
3. Add route: To navigation stack

### Add API Endpoint
1. Create method: In `src/services/api.js`
   ```javascript
   async getNewData(forceRefresh = false) {
     return this.getCachedData(
       'cache_key',
       () => this.axiosInstance.post('/endpoint.php', {}),
       { forceRefresh }
     );
   }
   ```
2. Use: In screen component
   ```javascript
   const data = await api.getNewData();
   ```

### Modify Cache Duration
**File:** `src/services/api.js` - Line 4
```javascript
const CACHE_DURATION = 5 * 60 * 1000; // Change this
```

---

## 📞 File Quick Reference

| Need | File | Line |
|------|------|------|
| Change API URL | src/services/api.js | 5 |
| Add auth | src/context/AuthContext.js | 50+ |
| Add screen | src/navigation/Navigation.js | 40+ |
| Change colors | src/screens/*/Screen.js | styles |
| Add endpoint | src/services/api.js | 140+ |
| Configure app | app.json | 1+ |
| Change cache | src/services/api.js | 4 |

---

## 🎯 Next Steps

1. **Read** → [README.md](README.md)
2. **Setup** → [QUICK_START.md](QUICK_START.md)
3. **Configure** → Update API_BASE_URL
4. **Run** → `npm start`
5. **Test** → Try login and features
6. **Customize** → Edit colors and screens
7. **Deploy** → Use Expo build service

---

**Happy coding! 🚀**
