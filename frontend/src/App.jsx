import './index.css'
import { Routes, Route } from "react-router-dom"; // Định nghĩa Router thì mới dùng được <Link> trong Login

// Authentication
import LoginPage from './pages/Authentication/LoginPage'
import RegisterPage from './pages/Authentication/RegisterPage';

// Dashboard
import DashboardPage from './pages/Dashboard/DashboardPage';

// Layout
import Layout from './components/Layout/Layout';

// Schedule
import SchedulePage from './pages/Schedule/SchedulePage';

// Buses
import BusesPage from './pages/Buses/BusesPage';

// Routes
import RoutesPage from './pages/Routes/RoutesPage';

// Students
import StudentsPage from './pages/Students/StudentsPage';

// Tracking
import TrackingPage from './pages/Tracking/TrackingPage';

//User
import UsersPage from './pages/Users/UsersPage';

// Notification
import NotificationPage from './pages/Notifications/NotificationPage';

// Profile
import ProfilePage from './pages/Profile/ProfilePage';


function App() {


  return (
    <>
      <BusesPage></BusesPage>
    </>
  )
}

export default App
