
const express = require("express");
const router = express.Router();

const Reservation = require("../models/Reservation");
const Bus = require("../models/Bus");

// Booking tickets
router.post("/", async (req, res) => {
  try {
    const { passengerName, email, phone, busId, seatsBooked } = req.body;

    if (
      !passengerName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !busId ||
      !Number.isInteger(seatsBooked) ||
      seatsBooked < 1
    ) {
      return res.status(400).json({
        message: "Enter valid passenger details and seat count"
      });
    }

    // Reduce available seats only if enough seats exist
    const bus = await Bus.findOneAndUpdate({
        _id: busId,
        availableSeats: { $gte: seatsBooked }
      },
      {
        $inc: { availableSeats: -seatsBooked }
      },
      { new: true }
    );

    if (!bus) {
      return res.status(400).json({
        message: "Bus not found or not enough seats available"
      });
    }

    try {
      const reservation = await Reservation.create({
        passengerName,
        email,
        phone,
        bus: bus._id,
        seatsBooked
      });

      res.status(201).json({
        message: "Ticket booked successfully",
        reservation
      });
    } catch (error) {
      // Restore seats if reservation creation fails
      await Bus.updateOne(
        { _id: bus._id },
        { $inc: { availableSeats: seatsBooked } }
      );
      throw error;
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// View all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("bus")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel a reservation
router.put("/cancel/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, status: "Booked" },
      { $set: { status: "Cancelled" } },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found or already cancelled"
      });
    }

    const bus = await Bus.findByIdAndUpdate(
      reservation.bus,
      { $inc: { availableSeats: reservation.seatsBooked } },
      { new: true }
    );

    if (!bus) {
      // Restore the booking status if the bus unexpectedly is missing
      await Reservation.updateOne(
        { _id: reservation._id, status: "Cancelled" },
        { $set: { status: "Booked" } }
      );

      return res.status(409).json({
        message: "Bus not found; cancellation could not be completed"
      });
    }

    res.json({
      message: "Ticket cancelled successfully",
      reservation
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
