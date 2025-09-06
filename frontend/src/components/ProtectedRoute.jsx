import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {

  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try{

        const res = await fetch("http://localhost:4000/api/v1/auth/me", {
          method:"GET",
          headers: {
            "Content-Type":"application/json"
          },
          credentials: "include"
        })
        
        const data = await res.json()
        if(res.ok && data.success){
          setIsAuth(true)        
        } else {
          setIsAuth(false)
        }
      }catch(err){
        setIsAuth(false)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  },[])

  if(loading) return <div>Loading...</div>
  if(!isAuth) return <Navigate to="/login" replace /> 

  return children
}
