
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  passengerName: {type: String,required: true},
  email: {type: String,required: true},
  phone: {type: String,required: true},
  bus: {type: mongoose.Schema.Types.ObjectId,ref: "Bus",required: true},
  seatsBooked: {type: Number,required: true,min: 1},
  status: {type: String,enum: ["Booked", "Cancelled"],default: "Booked"}
}, {
  timestamps: true
});

module.exports = mongoose.model("Reservation",reservationSchema);
