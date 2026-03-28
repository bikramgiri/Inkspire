require ("dotenv").config ();
const express = require ("express");
const { connectDB } = require("./database/connection");
const app = express ();

// Database connection
connectDB ();

app.get ("/", (req, res) => {
    res.send ("Hello World!");
});

const PORT = process.env.PORT;
app.listen (PORT, () => {
    console.log (`Server is running on port ${PORT}`);
});
