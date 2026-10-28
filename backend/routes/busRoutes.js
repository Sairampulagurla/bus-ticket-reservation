
const express = require("express");
const router = express.Router();
const Bus = require("../models/Bus");
const Reservation = require("../models/Reservation");

// here we are adding a new bus
router.post("/", async (req, res) => {
  try {
    const bus = await Bus.create({
      ...req.body,
      availableSeats: req.body.totalSeats
    });

    res.status(201).json(bus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// view all buses
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find().sort({ travelDate: 1 });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  this will use to search for buses
router.get("/search", async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const filter = {};

    if (source) {
      filter.source = { $regex: source, $options: "i" };
    }

    if (destination) {
      filter.destination = {
        $regex: destination,
        $options: "i"
      };
    }

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);

      filter.travelDate = { $gte: start, $lt: end };
    }

    const buses = await Bus.find(filter);
    res.json(buses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// edit a bus (updating the bus seats)
router.put("/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    if (req.body.totalSeats !== undefined && 
        req.body.totalSeats < bus.totalSeats - bus.availableSeats) {
      return res.status(400).json({
        message: "Total seats cannot be less than booked seats"
      });
    }

    const updatedData = { ...req.body };

    if (updatedData.totalSeats !== undefined) {
      updatedData.availableSeats =
        updatedData.totalSeats - (bus.totalSeats - bus.availableSeats);
    }

    Object.assign(bus, updatedData);
    await bus.save();

    res.json(bus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a bus if it has no active reservations
router.delete("/:id", async (req, res) => {
  try {
    const active = await Reservation.exists({
      bus: req.params.id,
      status: "Booked"
    });

    if (active) {
      return res.status(400).json({
        message: "Cancel active reservations before deleting this bus"
      });
    }

    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
