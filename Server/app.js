require ("dotenv").config ();
const express = require ("express");
const app = express ();
const cors = require ("cors");
const { connectDB } = require("./database/connection");

// Cors
app.use(cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true
}))

// Middleware
app.use (express.json ());
app.use (express.urlencoded ({ extended: true }));

// Database connection
connectDB ();

// Routes
app.use ("/api", require ("./routes/auth/authRoutes"));
app.use ("/api", require ("./routes/category/categoryRoutes"));
app.use ("/api", require ("./routes/blog/blogRoutes"));

// Static folder for images
app.use("/storage", express.static("storage"));

const PORT = process.env.PORT;
app.listen (PORT, () => {
    console.log (`Server is running on port ${PORT}`);
});
