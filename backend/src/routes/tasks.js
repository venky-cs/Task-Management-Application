const express = require("express");
const Task = require("../models/Task");
const { authenticate, authorizeAdmin } = require("../middleware/auth");
const router = express.Router();

// create
router.post("/", authenticate, async (req, res) => {
  try {
    const t = new Task({ ...req.body, createdBy: req.user._id });
    await t.save();
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// list (paginated)
router.get("/", authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Task.countDocuments();
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email");
    res.json({ tasks, total, totalPages: Math.ceil(total / limit), page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get
router.get("/:id", authenticate, async (req, res) => {
  try {
    const t = await Task.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!t) return res.status(404).json({ error: "Task not found" });
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update
router.put("/:id", authenticate, async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete (admin)
router.delete("/:id", authenticate, authorizeAdmin, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
