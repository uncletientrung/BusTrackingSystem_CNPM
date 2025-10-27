# BusTrackingSystem_CNPM

A comprehensive Bus Tracking System for school transportation management.

## Features
- Real-time bus tracking
- Student management
- Route and stop management
- Schedule management
- User authentication and authorization
- Notifications
- Chat functionality

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: PHP (XAMPP)
- **Database**: MySQL
- **Styling**: TailwindCSS
- **Maps**: Leaflet

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [XAMPP](https://www.apachefriends.org/) (for PHP and MySQL)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/uncletientrung/BusTrackingSystem_CNPM.git
cd BusTrackingSystem_CNPM
```

#### 2. Setup Backend (XAMPP)
See [XAMPP_SETUP.md](XAMPP_SETUP.md) for detailed backend configuration instructions.

Quick steps:
- Install and start XAMPP
- Copy `backend-example` to `C:\xampp\htdocs\bus-tracking-api\`
- Create database using phpMyAdmin
- Configure database connection in `backend-example/config.php`

#### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` to configure your backend URL (default is localhost:80).

#### 4. Run the Application

Start XAMPP services (Apache + MySQL), then:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Documentation
- [XAMPP Setup Guide](XAMPP_SETUP.md) - Complete guide for connecting to XAMPP backend
- [Backend Example](backend-example/README.md) - PHP backend implementation examples

## Project Structure
```
BusTrackingSystem_CNPM/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   └── hooks/         # Custom React hooks
│   ├── .env.example       # Environment variables template
│   └── vite.config.js     # Vite configuration with XAMPP proxy
├── backend-example/       # Example PHP backend for XAMPP
│   ├── api/              # API endpoints
│   ├── config.php        # Database configuration
│   └── .htaccess         # Apache URL rewriting
├── XAMPP_SETUP.md        # XAMPP connection guide
└── README.md             # This file
```

## Development

### Available Scripts

In the `frontend` directory:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints

The backend provides the following REST API endpoints:

- `POST /api/login` - User authentication
- `POST /api/register` - User registration
- `GET /api/users` - Get all users
- `GET/POST/PUT/DELETE /api/buses` - Bus management
- `GET/POST/PUT/DELETE /api/routes` - Route management
- `GET/POST/PUT/DELETE /api/stops` - Stop management
- `GET/POST/PUT/DELETE /api/students` - Student management
- `GET/POST/PUT/DELETE /api/schedule` - Schedule management
- `GET/POST /api/tracking` - Real-time tracking
- `GET/POST /api/notifications` - Notifications
- `GET/PUT /api/profile` - User profile

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Support
For issues and questions, please open an issue on GitHub or refer to [XAMPP_SETUP.md](XAMPP_SETUP.md) for troubleshooting.
