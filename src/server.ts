import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import protectedRoutes from "./routes/protected";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


mongoose.connect(process.env.MONGO_URI!)
.then(()=> console.log("MongoDB Connected"))
.catch((error)=>console.log(error));

app.use("/auth",authRoutes);
app.use("/protected",protectedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log("listening on port ${PORT}"))