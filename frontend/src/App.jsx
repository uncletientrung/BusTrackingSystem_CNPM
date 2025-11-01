import './index.css'
import { Routes, Route, Navigate } from "react-router-dom"; // Định nghĩa Router thì mới dùng được <Link> trong Login

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

// Stops
import StopsPage from './pages/Stops/StopsPage';

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

// Chat
import ChatPage from './pages/Chat/ChatPage';

// Error
import NotFoundPage from './pages/Error/NotFoundPage';
import DriverPage from './pages/Driver/DriverPage';

//Components
import PrivateRoute from './components/Auth/PrivateRoute';
import UnauthorizedPage from './pages/Error/UnauthorizedPage';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path='/' element={<Layout />}>
          {/* Các route con sẽ được render trong <Outlet /> của Layout */}
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path='buses' element={
            <PrivateRoute allowedRoles={["admin"]}>
              <BusesPage />
            </PrivateRoute>
          } />

          <Route path='routes' element={
            <PrivateRoute allowedRoles={["admin"]}>
              <RoutesPage />
            </PrivateRoute>
          } />

          <Route path='stops' element={
            <PrivateRoute allowedRoles={["admin"]}>
              <StopsPage />
            </PrivateRoute>
          } />

          <Route path='students' element={
            <PrivateRoute allowedRoles={["admin", "parent"]}>
              <StudentsPage />
            </PrivateRoute>
          } />

          <Route
            path='students/:id'
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <StudentDetailPage />
              </PrivateRoute>
            } />

          <Route path='tracking' element={<TrackingPage />} />

          <Route path='schedule' element={
            <PrivateRoute allowedRoles={["admin"]}>
              <SchedulePage />
            </PrivateRoute>
          } />

          <Route path='chat' element={
            <PrivateRoute allowedRoles={["admin", "driver"]}>
              <ChatPage />
            </PrivateRoute>
          } />

          <Route path='users' element={
            <PrivateRoute allowedRoles={["admin"]}>
              <UsersPage />
            </PrivateRoute>
          } />

          <Route path='users/:id'
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <UserDetailPage />
              </PrivateRoute>
            } />

          <Route path='notifications' element={<NotificationPage />} />

          <Route path='driver' element={
            <PrivateRoute allowedRoles={["driver"]}>
              <DriverPage />
            </PrivateRoute>
          } />

          <Route path='profile' element={<ProfilePage />} />


        </Route>

        {/* Các route không dùng Layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route bắt tất cả đường dẫn không tồn tại */}
        <Route path="*" element={<NotFoundPage />} />

        {/* Route truy cập trang không quyền */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>


    </>
  )
}

export default App
