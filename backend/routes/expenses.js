const express = require("express");
const Expense = require("../models/Expense");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   POST /expense
// @desc    Add a new expense
// @access  Protected
router.post("/expense", protect, async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Please provide title, amount and category" });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
      notes,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Server error adding expense", error: error.message });
  }
});

// @route   GET /expenses
// @desc    Get all expenses of logged-in user
// @access  Protected
router.get("/expenses", protect, async (req, res) => {
  try {
    const { category, startDate, endDate, sort } = req.query;

    // Build filter
    const filter = { user: req.user._id };
    if (category && category !== "All") filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Sort options
    const sortOption = sort === "amount" ? { amount: -1 } : { date: -1 };

    const expenses = await Expense.find(filter).sort(sortOption);

    // Calculate total
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      count: expenses.length,
      total: parseFloat(total.toFixed(2)),
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Server error fetching expenses", error: error.message });
  }
});

// @route   DELETE /expense/:id
// @desc    Delete an expense
// @access  Protected
router.delete("/expense/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Server error deleting expense", error: error.message });
  }
});

module.exports = router;
