import path from "path"
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.mjs"
import colors from "colors"
import productRoutes from "./routes/productRoutes.mjs"
import userRoutes from "./routes/userRoutes.mjs"
import orderRoutes from "./routes/orderRoutes.mjs"
import uploadRoutes from "./routes/uploadRoutes.mjs"
import morgan from "morgan"
import { notFound, errorHandler } from "./middleware/errorMiddleware.mjs"

dotenv.config()

console.log("HELLO", process.env.MONGO_URI)

connectDB()

const app = express()

if (process.env.NODE_ENV === "development") app.use(morgan("dev"))

app.use(express.json())

app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  })
} else {
  app.get("/", (req, res) => {
    res.send("server is running")
  })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
)
