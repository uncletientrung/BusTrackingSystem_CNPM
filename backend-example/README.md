# Backend Example for XAMPP

This directory contains example PHP backend files that demonstrate how to set up the API endpoints for the Bus Tracking System.

## Setup Instructions

### 1. Copy to XAMPP htdocs
Copy this entire `backend-example` folder to your XAMPP `htdocs` directory:
```
C:\xampp\htdocs\bus-tracking-api\
```

### 2. Create Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create a new database named `bus_tracking_system`
3. Run the SQL script below to create the users table

### 3. Database Schema

```sql
CREATE DATABASE IF NOT EXISTS bus_tracking_system;
USE bus_tracking_system;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'driver', 'parent', 'student') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert test user (password: password123)
INSERT INTO users (email, password, name, role) VALUES 
('admin@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin');
```

### 4. Update Vite Config
Update the proxy target in `frontend/vite.config.js` if needed:
```javascript
target: 'http://localhost/bus-tracking-api'
```

### 5. Test the API
Test the login endpoint:
```bash
curl -X POST http://localhost/bus-tracking-api/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'
```

## File Structure

```
backend-example/
├── config.php          - Database connection configuration
├── api/
│   └── login.php       - Login endpoint example
└── README.md          - This file
```

## Adding More Endpoints

To add more API endpoints, create new PHP files in the `api/` directory:

- `api/register.php` - User registration
- `api/users.php` - User CRUD operations
- `api/buses.php` - Bus management
- `api/routes.php` - Route management
- etc.

Each endpoint should:
1. Include CORS headers
2. Include the config.php for database connection
3. Validate input data
4. Use prepared statements to prevent SQL injection
5. Return JSON responses

## Security Notes

⚠️ This is a basic example for development. For production:

1. **Use JWT** instead of simple tokens
2. **Hash passwords** with `password_hash()` and verify with `password_verify()`
3. **Validate and sanitize** all input data
4. **Use HTTPS** in production
5. **Implement rate limiting** to prevent brute force attacks
6. **Use environment variables** for sensitive configuration
7. **Add proper error logging**
8. **Implement proper authentication middleware**

## Troubleshooting

### CORS Errors
Make sure the CORS origin matches your frontend URL:
```php
header("Access-Control-Allow-Origin: http://localhost:5173");
```

### Database Connection Failed
- Check MySQL is running in XAMPP Control Panel
- Verify database name in `config.php`
- Check MySQL port (default is 3306)

### 404 Errors
- Verify files are in the correct htdocs subdirectory
- Check Apache is running in XAMPP Control Panel
- Ensure URLs match the file structure
