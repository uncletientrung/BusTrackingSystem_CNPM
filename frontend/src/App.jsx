import './index.css'
import LoginPage from './pages/Authentication/LoginPage'
import { Routes, Route } from "react-router-dom"; // Định nghĩa Router thì mới dùng được <Link> trong Login


function App() {


  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
