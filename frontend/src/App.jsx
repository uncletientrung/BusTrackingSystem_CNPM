import './index.css'
import { Routes, Route } from "react-router-dom"; // Định nghĩa Router thì mới dùng được <Link> trong Login

// Authentication
import LoginPage from './pages/Authentication/LoginPage'
import RegisterPage from './pages/Authentication/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import Layout from './components/Layout/Layout';


function App() {


  return (
    <>
      <Routes>
         <Route path='/' element={<Layout />}> 
          {/* Các route con sẽ được render trong <Outlet /> của Layout */}
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

         {/* Các route không dùng Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App
