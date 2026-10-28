
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/buses", require("./routes/busRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));

app.get("/", (req, res) => {
  res.send("Bus Ticket Reservation API is running");
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port: http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
