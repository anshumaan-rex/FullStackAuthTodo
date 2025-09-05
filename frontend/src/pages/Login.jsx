import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [errors, setErrors] = useState([])

  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")
    setLoading(true)
    setErrors([])

    try{
      const res = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      })

      const data = await res.json()

      if(res.ok && data.success){
        setSuccessMessage(data.message)    
        setTimeout(() => navigate('/dashboard'),2000)
      } else {
        setErrorMessage(data.message)
        if(data.errors) setErrors(data.errors)
      }
    }catch{
      setErrorMessage("Network error. Please try again later")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}
      {errors.length > 0 && (
        <ul className="text-red-500 text-sm mb-2">
          {errors.map((err,idx) => (
            <li key={idx}>{err.path}: {err.error}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="email" value={email} placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <input type="password" value={password} placeholder="Enter your Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <button type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
