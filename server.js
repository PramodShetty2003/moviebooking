const express = require("express");
const cors = require("cors");
const { DB_URL } = require("./config/db.config"); // Import dbConfig
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Cannot connect to the database!", err);
    process.exit(1); // Exit the process with an error code
  });
// Routes

// Simple route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Movie Booking application." });
});

app.get("/movies",(req,res)=>{
    res.send("All Movies Data in JSON format from Mongo DB");
});

app.get("/genres",(req,res)=>{
    res.send("All Genres Data in JSON format from Mongo DB");
});

app.get("/artists",(req,res)=>{
    res.send("All Artists Data in JSON format from Mongo DB");
});

// Set port and listen for requests
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});