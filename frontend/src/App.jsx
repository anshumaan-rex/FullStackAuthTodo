import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import PasswordReset from "./pages/PasswordReset"
import Verify from "./pages/Verify"
import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset" element={<PasswordReset />} />
      </Routes>
    </div>
  )
}