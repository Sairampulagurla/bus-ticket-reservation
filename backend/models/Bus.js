
const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: { type: String,required: true,unique: true},
  busName: { type: String, required: true},
  source: {type: String,required: true},
  destination: {type: String,required: true},
  departureTime: {type: String,required: true},
  travelDate: {type: Date,required: true},
  totalSeats: {type: Number,required: true,min: 1},
  availableSeats: {type: Number,required: true}
});

module.exports = mongoose.model("Bus", busSchema);
