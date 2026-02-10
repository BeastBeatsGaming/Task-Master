import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import todoRoutes from "./routes/todoRoutes";
import authRoutes from "./routes/authRoutes"; // Add this
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

dotenv.config();
connectDB();

const app: Express = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/auth", authRoutes); // Add auth routes
app.use("/api/todos", todoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${port}`
  );
});
