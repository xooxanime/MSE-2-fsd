const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ["Academic", "Hostel", "Transport", "Other"],
    default: "Other"
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    default: "Pending"
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Grievance", grievanceSchema);