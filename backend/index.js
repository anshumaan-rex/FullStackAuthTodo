import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"
import todoRouter from "./routes/todoRoutes.js"

dotenv.config({ quiet: true })

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())

const allOrigins = process.env.FRONTEND_URLS.split(",")
app.use(cors({
  origin: allOrigins,
  credentials: true
}))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/todo", todoRouter)

app.get("/", (req, res) => {
  res.send("Backend is running 🚀")
})

connectDB().then(()=>{
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
})
