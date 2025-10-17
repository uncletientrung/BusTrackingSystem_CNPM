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
import StudentDetailPage from './pages/Students/StudentDetailPage';

// Tracking
import TrackingPage from './pages/Tracking/TrackingPage';

//User
import UsersPage from './pages/Users/UsersPage';

// Notification
import NotificationPage from './pages/Notifications/NotificationPage';

// Profile
import ProfilePage from './pages/Profile/ProfilePage';
import UserDetailPage from './pages/Users/UserDetailPage';

// Error
import NotFoundPage from './pages/Error/NotFoundPage';



function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          {/* Các route con sẽ được render trong <Outlet /> của Layout */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path='buses' element={<BusesPage />} />
          <Route path='routes' element={<RoutesPage />} />
          <Route
            path='students'
            element={<StudentsPage />}

          />
          <Route
            path='students/:id'
            element={<StudentDetailPage />}
          />
          <Route path='tracking' element={<TrackingPage />} />
          <Route path='schedule' element={<SchedulePage />} />
          <Route path='users'
            element={<UsersPage />}
          />
          <Route path='users/:id'
            element={<UserDetailPage />}
          />
          <Route path='notifications' element={<NotificationPage />} />
          <Route path='profile' element={<ProfilePage />} />


        </Route>

        {/* Các route không dùng Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Route bắt tất cả đường dẫn không tồn tại */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>


    </>
  )
}

export default App
