// API Configuration for connecting to XAMPP backend
// This file centralizes the API configuration settings

const API_CONFIG = {
  // Base URL for the backend API (XAMPP server)
  // In development, Vite proxy will handle the /api routes
  // In production, this should point to your actual backend server
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:80',
  
  // API endpoints
  endpoints: {
    login: '/api/login',
    register: '/api/register',
    users: '/api/users',
    buses: '/api/buses',
    routes: '/api/routes',
    stops: '/api/stops',
    students: '/api/students',
    schedule: '/api/schedule',
    tracking: '/api/tracking',
    notifications: '/api/notifications',
    profile: '/api/profile',
    chat: '/api/chat',
  },
  
  // Request timeout in milliseconds
  timeout: 10000,
  
  // Default headers
  headers: {
    'Content-Type': 'application/json',
  }
};

export default API_CONFIG;
