import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export default function Verify() {
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    async function verifyEmail(){
      setLoading(true)
      setError("")
      setMessage("")

      try{
        const res = await fetch(`http://localhost:4000/api/v1/auth/verify?token=${token}`)
        const data = await res.json()

        if(res.ok && data.success) {
          setMessage(data.message + " - Now you can Login")
        } else {
          setError(data.message || "Something went wrong")
        }
      }catch{
        setError("Network error. Please try again later")
      } finally {
        setLoading(false)
      }
    }
    verifyEmail()
  },[])

  return (
    <div className={`max-w-md mx-auto p-6 rounded-xl shadow-md text-center 
      ${loading ? "bg-yellow-200" : message ? "bg-green-200" : "bg-red-200"}`}>
      
      {message && <p className="text-green-700 font-semibold">{message}</p>}
      {error && <p className="text-red-700 font-semibold">{error}</p>}
      {loading && <p className="text-gray-700 font-semibold">Verifying...</p>}
    </div>
  )
}
