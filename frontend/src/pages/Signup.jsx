import { useState } from 'react'

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e){
    e.preventDefault()
    try{
      setLoading(true)
      setErrors([])
      setErrorMessage("")
      setSuccessMessage("")

      const res = await fetch("http://localhost:4000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if(res.ok && data.success){
        setSuccessMessage(data.message)
        setFormData({ name: "", email: "", password: "" })
      } else {
        setErrorMessage(data.message || "Something went wrong")
        if(data.errors) setErrors(data.errors)
      }
    }catch{
      setErrorMessage("Network error, please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

      {successMessage && <p className="text-green-600 mb-2">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}
      {errors.length > 0 && (
        <ul className="text-red-500 text-sm mb-2">
          {errors.map((err, idx) => (
            <li key={idx}>{err.path} : {err.error}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="name" value={formData.name}
          placeholder="Enter your Name"
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <input type="email" name="email" value={formData.email}
          placeholder="yourEmail@example.com"
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <input type="password" name="password" value={formData.password}
          placeholder="your password"
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />

        <button type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  )
}
