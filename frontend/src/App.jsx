import './index.css'
import { Routes, Route } from "react-router-dom"; // Định nghĩa Router thì mới dùng được <Link> trong Login

// Authentication
import LoginPage from './pages/Authentication/LoginPage'
import RegisterPage from './pages/Authentication/RegisterPage';


function App() {


  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      {/* <RegisterPage></RegisterPage> */}
    </>
  )
}

export default App
