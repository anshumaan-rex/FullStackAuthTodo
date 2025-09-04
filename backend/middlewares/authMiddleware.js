import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const protect = async (req, res, next) => {
  try{
    const token = req.cookies?.token
    if(!token) {
      return res.status(401).json({
        success: false,
        message: "unauthorized. Token not found"
      })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.id).select("-password")
    if(!user){
      return res.status(404).json({
        success: false,
        message: "user not found"
      })
    }
    req.user = user
    next()

  }catch(err){
    console.error('Error in Auth middleware', err.message)
    return res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}