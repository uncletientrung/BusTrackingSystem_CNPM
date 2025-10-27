# XAMPP Backend Connection Setup Guide

## Overview
This guide explains how to connect the Bus Tracking System frontend to a XAMPP backend server.

## Prerequisites
1. **XAMPP Installed**: Download and install XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. **XAMPP Running**: Start Apache and MySQL services from XAMPP Control Panel

## Backend Setup

### 1. Create Backend Directory
Create a backend folder in your XAMPP `htdocs` directory:
```
C:\xampp\htdocs\bus-tracking-api\
```

### 2. Database Configuration
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create a new database named `bus_tracking_system`
3. Import the database schema (if available)

### 3. Backend API Structure
Your backend should have the following API endpoints:

```
/api/login          - POST - User login
/api/register       - POST - User registration
/api/users          - GET/POST/PUT/DELETE - User management
/api/buses          - GET/POST/PUT/DELETE - Bus management
/api/routes         - GET/POST/PUT/DELETE - Route management
/api/stops          - GET/POST/PUT/DELETE - Stop management
/api/students       - GET/POST/PUT/DELETE - Student management
/api/schedule       - GET/POST/PUT/DELETE - Schedule management
/api/tracking       - GET/POST - Real-time tracking
/api/notifications  - GET/POST - Notifications
/api/profile        - GET/PUT - User profile
/api/chat           - GET/POST - Chat messages
```

## Frontend Configuration

### 1. Environment Variables
The frontend uses environment variables for configuration. Copy `.env.example` to `.env`:

```bash
cd frontend
cp .env.example .env
```

### 2. Configure Backend URL
Edit `frontend/.env` file:

```env
# Default XAMPP configuration
VITE_API_BASE_URL=http://localhost:80
VITE_API_ENDPOINT=/api

# If XAMPP runs on a different port (e.g., 8080):
# VITE_API_BASE_URL=http://localhost:8080
```

### 3. Vite Proxy Configuration
The Vite development server is configured to proxy API requests to XAMPP. This is already set up in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:80',
      changeOrigin: true,
    }
  }
}
```

## Running the Application

### 1. Start XAMPP
- Open XAMPP Control Panel
- Start Apache service (for PHP backend)
- Start MySQL service (for database)

### 2. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Testing the Connection

### 1. Check XAMPP Status
- Apache should show "Running" in green
- MySQL should show "Running" in green
- Test by visiting `http://localhost` in your browser

### 2. Test API Endpoints
You can test individual endpoints using tools like:
- Postman
- cURL
- Browser DevTools Network tab

Example cURL command:
```bash
curl -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Frontend Console
Open browser DevTools (F12) and check the Console tab for any connection errors.

## Troubleshooting

### Problem: "Network Error" in Console
**Solution**: 
- Check if XAMPP Apache is running
- Verify the port number in `.env` matches your XAMPP configuration
- Check XAMPP error logs in `C:\xampp\apache\logs\error.log`

### Problem: CORS Errors
**Solution**: Add CORS headers to your PHP backend:
```php
<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
?>
```

### Problem: Port 80 Already in Use
**Solution**:
1. Open XAMPP Control Panel
2. Click "Config" button next to Apache
3. Select "httpd.conf"
4. Find `Listen 80` and change to `Listen 8080`
5. Update `frontend/.env`: `VITE_API_BASE_URL=http://localhost:8080`
6. Update `frontend/vite.config.js` proxy target to `http://localhost:8080`

### Problem: 404 Not Found for API Endpoints
**Solution**:
- Ensure your backend files are in the correct XAMPP directory
- Check that `.htaccess` is configured for URL rewriting (if using)
- Verify Apache `mod_rewrite` is enabled in XAMPP

## API Client Features

The frontend includes a pre-configured API client (`src/utils/apiClient.js`) with:

- **Automatic Token Handling**: Adds authentication tokens to all requests
- **Session Management**: Handles cookies and sessions with XAMPP backend
- **Error Handling**: Automatically redirects to login on 401 errors
- **Request/Response Interceptors**: For logging and debugging
- **Timeout Configuration**: Prevents hanging requests

## Production Deployment

For production, update the `.env` file with your production backend URL:

```env
VITE_API_BASE_URL=https://your-domain.com
VITE_API_ENDPOINT=/api
```

Then build the frontend:
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` and can be deployed to any web server.

## Additional Resources

- [XAMPP Documentation](https://www.apachefriends.org/docs/)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)
- [Axios Documentation](https://axios-http.com/docs/intro)

## Support

If you encounter issues:
1. Check XAMPP logs in `C:\xampp\apache\logs\`
2. Check browser DevTools Console and Network tabs
3. Verify all services are running in XAMPP Control Panel
