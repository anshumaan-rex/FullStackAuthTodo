import express from "express"
import { forgotPassword, login, logout, resetPassword, signup, verify } from "../controllers/authController.js"
import { protect } from "../middlewares/authMiddleware.js"

const authRouter = express.Router()

authRouter.post("/signup", signup)
authRouter.get("/verify", verify)
authRouter.post("/login", login)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)
authRouter.get("/me", protect,(req,res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  })
})

authRouter.post("/logout", logout)
export default authRouter