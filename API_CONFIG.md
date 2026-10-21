# API Configuration Guide

## 🔗 API Endpoints Required

Your backend needs these endpoints. All existing PHP files support them.

### Authentication
**Endpoint:** `POST /login.php`

**Request:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "lastLogin": "2024-01-15 10:30:00"
  }
}
```

---

### Student Management
**Endpoint:** `POST /fetch-student.php`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ID": 1,
      "UID": "UID001",
      "Name": "John Doe",
      "Roll": "001",
      "Class": "10A",
      "last_login": "2024-01-15"
    }
  ]
}
```

---

### Attendance Records
**Endpoint:** `POST /fetch-attendance.php`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "date": "2024-01-15",
      "status": "present",
      "checkin_time": "09:00:00"
    }
  ]
}
```

---

### Mark Attendance
**Endpoint:** `POST /mark-attendance.php`

**Request:**
```json
{
  "student_id": 1,
  "date": "2024-01-15",
  "status": "present",
  "checkin_time": "09:00:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully"
}
```

---

### QR Check-in
**Endpoint:** `POST /qr-checkin.php`

**Request:**
```json
{
  "qr_data": "STUDENT_UID_or_ENCODED_DATA"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check-in successful",
  "student": {
    "id": 1,
    "name": "John Doe"
  }
}
```

---

### RFID Check-in
**Endpoint:** `POST /rfid-checkin.php`

**Request:**
```json
{
  "rfid_tag": "RFID_TAG_VALUE"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check-in successful"
}
```

---

### Holidays
**Endpoint:** `POST /fetch-holidays.php`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2024-01-26",
      "name": "Republic Day",
      "description": "National Holiday"
    }
  ]
}
```

---

### Materials
**Endpoint:** `POST /fetch-materials.php`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Mathematics Chapter 1",
      "description": "Basic Concepts",
      "url": "https://example.com/material.pdf",
      "uploaded_date": "2024-01-15"
    }
  ]
}
```

---

## 🔄 Error Handling

All endpoints should return:

**Error Response:**
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

---

## 🌐 Backend Setup

### 1. Update Connection (conn.php)
```php
<?php
$host = 'localhost';      // Database host
$dbname = 'edutracko';    // Database name
$username = 'root';       // MySQL user
$password = '';           // MySQL password

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
?>
```

### 2. Enable CORS (Already in login.php)
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

### 3. Verify All Files Exist
- ✅ login.php
- ✅ fetch-student.php
- ✅ fetch-attendance.php
- ✅ mark-attendance.php
- ✅ qr-checkin.php
- ✅ rfid-checkin.php
- ✅ fetch-holidays.php
- ✅ fetch-materials.php
- ✅ conn.php

---

## 🔐 Security Recommendations

### 1. Use HTTPS
```javascript
// Secure (production)
const API_BASE_URL = 'https://api.yourdomain.com';

// Not secure (development only)
const API_BASE_URL = 'http://localhost:8000';
```

### 2. Add API Key
```php
// In your PHP endpoints
$api_key = $_SERVER['HTTP_X_API_KEY'] ?? null;
if ($api_key !== 'your-secret-key') {
    http_response_code(401);
    die(json_encode(['success' => false, 'message' => 'Unauthorized']));
}
```

```javascript
// In src/services/api.js
setAuthToken(token) {
  this.axiosInstance.defaults.headers.common['X-API-Key'] = 'your-secret-key';
}
```

### 3. Rate Limiting
```php
// Add rate limiting to prevent abuse
$user_ip = $_SERVER['REMOTE_ADDR'];
// Implement rate limit logic
```

### 4. Input Validation
```php
// Validate all inputs
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die(json_encode(['success' => false]));
}
```

---

## 🚀 Testing API Endpoints

### Using cURL
```bash
# Test login
curl -X POST http://localhost:8000/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Test fetch students
curl -X POST http://localhost:8000/fetch-student.php \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Using Postman
1. Create collection "EduTracko"
2. Add requests for each endpoint
3. Set base URL: `{{base_url}}`
4. Create environment variable:
   ```
   base_url = http://localhost:8000
   ```

---

## 📊 Caching Strategy

The app implements intelligent caching:

```javascript
// Cache for 5 minutes by default
const students = await api.getStudents();

// Force refresh (new API call)
const freshStudents = await api.getStudents(true);

// Cache duration in milliseconds
const CACHE_DURATION = 5 * 60 * 1000;

// Change cache duration for specific call
getCachedData('key', fetchFn, { 
  cacheDuration: 10 * 60 * 1000  // 10 minutes
})
```

---

## 🔄 Request/Response Flow

```
Mobile App Request
    ↓
    ├─→ Check In-Memory Cache (instant if valid)
    │
    ├─→ Cache Invalid? → API Request to Backend
    │
    └─→ Response
        ├─→ Success: Cache + Return
        └─→ Error: Try AsyncStorage Fallback → Return
```

---

## 🛠️ Debugging

### Enable Logging
Edit `src/services/api.js`:
```javascript
// Add logging in each method
async login(username, password) {
  console.log('Login attempt:', username);
  try {
    const response = await this.retryRequest(() =>
      this.axiosInstance.post('/login.php', { username, password })
    );
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

### Check Network Tab
In development:
1. Open Expo DevTools
2. Go to Network tab
3. Monitor all API calls
4. Check response times and caching

---

## 📈 Performance Tips

1. **Reduce API Calls**
   - Use caching effectively
   - Combine requests where possible
   - Implement pagination

2. **Optimize Payloads**
   - Only send needed fields
   - Compress images
   - Use pagination for large datasets

3. **Monitor Performance**
   ```javascript
   // Measure request time
   const start = Date.now();
   const data = await api.getStudents();
   console.log('Request took:', Date.now() - start, 'ms');
   ```

---

## 🔗 Additional Resources

- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)
- [REST API Best Practices](https://restfulapi.net/)
- [JSON Format](https://www.json.org/)

---

**API is ready! Start testing with `npm start` 🚀**
