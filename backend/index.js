import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"

dotenv.config({ quiet: true })

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use("/api/v1/auth", authRouter)

app.get("/", (req, res) => {
  res.send("Backend is running 🚀")
})

connectDB().then(()=>{
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
})
