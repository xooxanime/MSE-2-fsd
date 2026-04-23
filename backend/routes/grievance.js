const express = require("express");
const Grievance = require("../models/Grievance");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ➕ CREATE
router.post("/grievances", auth, async (req, res) => {
  try {
    const grievance = await Grievance.create({
      ...req.body,
      user: req.user
    });

    res.json(grievance);
  } catch {
    res.status(500).json({ msg: "Error creating grievance" });
  }
});

// 📥 GET ALL
router.get("/grievances", auth, async (req, res) => {
  try {
    const data = await Grievance.find({ user: req.user });
    res.json(data);
  } catch {
    res.status(500).json({ msg: "Error fetching data" });
  }
});

// 🔍 GET BY ID
router.get("/grievances/:id", auth, async (req, res) => {
  try {
    const data = await Grievance.findById(req.params.id);
    res.json(data);
  } catch {
    res.status(500).json({ msg: "Error fetching item" });
  }
});

// ✏️ UPDATE
router.put("/grievances/:id", auth, async (req, res) => {
  try {
    const updated = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ msg: "Update failed" });
  }
});

// ❌ DELETE
router.delete("/grievances/:id", auth, async (req, res) => {
  try {
    await Grievance.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });
  } catch {
    res.status(500).json({ msg: "Delete failed" });
  }
});

// 🔎 SEARCH
router.get("/grievances/search", auth, async (req, res) => {
  try {
    const { title } = req.query;

    const data = await Grievance.find({
      user: req.user,
      title: { $regex: title, $options: "i" }
    });

    res.json(data);
  } catch {
    res.status(500).json({ msg: "Search failed" });
  }
});

module.exports = router;