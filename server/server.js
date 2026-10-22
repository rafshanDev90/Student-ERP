import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import cors from "cors";
import compression from "compression";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./config/db.js";
import webhookRoutes from "./routes/webhook.js";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses/course.routes.js";
import adminCourseRoutes from "./routes/courses/admincourse.routes.js";
import categoryRoutes from "./routes/courses/category.routes.js";
import userRoutes from "./routes/users/user.routes.js";
import studentCourseRoutes from "./routes/studentCourse.routes.js";
import { errorMiddleware } from "./middleware/ErrorMiddleware.js";

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json());


// Serve locally-stored fallback uploads (public/uploads/**)
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api/webhook", webhookRoutes);
app.use("/api/auth", authRoutes);

// Public course catalog + admin management
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminCourseRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/categories", categoryRoutes);

// Student ERP
app.use("/api/v1/courses", studentCourseRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});