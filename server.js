require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;;
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing from .env");
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env");
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: "admin.sid",

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "admin_sessions",
      ttl: 60 * 60 * 8,
    }),

    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
      path: "/",
    },
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running.",
  });
});

app.use("/api", authRoutes);

// Add your other existing routes here.

async function startServer() {
  await connectDB();

  app.listen(process.env.PORT || 5000, () => {
    console.log(
      `Server running on http://localhost:${process.env.PORT || 5000}`
    );
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});