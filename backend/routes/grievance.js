const express = require("express");
const Grievance = require("../models/Grievance");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE
router.post("/grievances", auth, async (req, res) => {
  const g = await Grievance.create({ ...req.body, user: req.user });
  res.json(g);
});

// GET ALL
router.get("/grievances", auth, async (req, res) => {
  const data = await Grievance.find({ user: req.user });
  res.json(data);
});

// 🔥 ADD THIS (UPDATE)
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

// DELETE
router.delete("/grievances/:id", auth, async (req, res) => {
  await Grievance.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

// SEARCH
router.get("/grievances/search", auth, async (req, res) => {
  const { title } = req.query;
  const data = await Grievance.find({
    user: req.user,
    title: { $regex: title, $options: "i" }
  });
  res.json(data);
});

module.exports = router;