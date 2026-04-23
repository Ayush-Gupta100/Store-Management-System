const express = require("express");
const Item = require("../models/Item");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   POST /items
// @desc    Add a new item
// @access  Protected
router.post("/items", protect, async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;

    if (!itemName || !description || !type || !location || !contactInfo) {
      return res.status(400).json({ message: "Please provide all required item details" });
    }

    const item = await Item.create({
      user: req.user._id,
      itemName,
      description,
      type,
      location,
      date: date || Date.now(),
      contactInfo,
    });

    res.status(201).json({
      message: "Item added successfully",
      item,
    });
  } catch (error) {
    console.error("Add item error:", error);
    res.status(500).json({ message: "Server error adding item", error: error.message });
  }
});

// @route   GET /items
// @desc    Get all items
// @access  Protected
router.get("/items", protect, async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ count: items.length, items });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ message: "Server error fetching items", error: error.message });
  }
});

// @route   GET /items/search
// @desc    Search items by itemName/type
// @access  Protected
router.get("/items/search", protect, async (req, res) => {
  try {
    const { name, type } = req.query;
    const filter = {};

    if (name) {
      filter.itemName = { $regex: name, $options: "i" };
    }
    if (type && ["Lost", "Found"].includes(type)) {
      filter.type = type;
    }

    const items = await Item.find(filter).populate("user", "name email").sort({ createdAt: -1 });
    res.json({ count: items.length, items });
  } catch (error) {
    console.error("Search items error:", error);
    res.status(500).json({ message: "Server error searching items", error: error.message });
  }
});

// @route   GET /items/:id
// @desc    Get item by ID
// @access  Protected
router.get("/items/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", "name email");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Get item by id error:", error);
    res.status(500).json({ message: "Server error fetching item", error: error.message });
  }
});

// @route   PUT /items/:id
// @desc    Update an item
// @access  Protected
router.put("/items/:id", protect, async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    item.itemName = itemName ?? item.itemName;
    item.description = description ?? item.description;
    item.type = type ?? item.type;
    item.location = location ?? item.location;
    item.date = date ?? item.date;
    item.contactInfo = contactInfo ?? item.contactInfo;

    const updated = await item.save();
    res.json({ message: "Item updated successfully", item: updated });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({ message: "Server error updating item", error: error.message });
  }
});

// @route   DELETE /items/:id
// @desc    Delete an item
// @access  Protected
router.delete("/items/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ message: "Server error deleting item", error: error.message });
  }
});

module.exports = router;
