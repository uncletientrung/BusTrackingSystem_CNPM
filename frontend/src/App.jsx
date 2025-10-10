import './index.css'
import { Routes, Route } from "react-router-dom"; // Định nghĩa Router thì mới dùng được <Link> trong Login

// Authentication
import LoginPage from './pages/Authentication/LoginPage'
import RegisterPage from './pages/Authentication/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import Layout from './components/Layout/Layout';
import SchedulePage from './pages/Schedule/SchedulePage';


function App() {


  return (
    <>
      <SchedulePage></SchedulePage>
    </>
  )
}

export default App
