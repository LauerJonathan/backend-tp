const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Configuration
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/travelplan")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define the Day Schema
const daySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

// Define the Travel Plan Schema
const travelPlanSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    default: "#ffb268",
  },
  days: {
    type: [daySchema],
    default: [],
  },
  font: {
    type: String,
    required: true,
    default: "Arial",
  },
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: "Rome",
  },
  notes: {
    type: [String],
    default: [],
  },
  textColor: {
    type: String,
    required: true,
    default: "#000000",
  },
});

const TravelPlan = mongoose.model("TravelPlan", travelPlanSchema);

// Routes

// GET - Retrieve all travel plans
app.get("/api/travelplan", async (req, res) => {
  try {
    const travelplans = await TravelPlan.find();
    res.json(travelplans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Retrieve a specific travel plan by numerical id (not MongoDB _id)
app.get("/api/travelplan/:id", async (req, res) => {
  try {
    const travelplan = await TravelPlan.findOne({
      id: parseInt(req.params.id),
    });
    if (!travelplan) {
      return res.status(404).json({ message: "Travel plan not found" });
    }
    res.json(travelplan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Create a new travel plan
app.post("/api/travelplan", async (req, res) => {
  try {
    const travelplan = new TravelPlan({
      ...req.body,
      days: req.body.days || [], // Ensure days is an array even if not provided
    });
    const newTravelplan = await travelplan.save();
    res.status(201).json(newTravelplan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Update an existing travel plan
app.put("/api/travelplan/:id", async (req, res) => {
  try {
    const travelplan = await TravelPlan.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      {
        new: true,
        runValidators: true, // This ensures update validation
      }
    );
    if (!travelplan) {
      return res.status(404).json({ message: "Travel plan not found" });
    }
    res.json(travelplan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete a travel plan
app.delete("/api/travelplan/:id", async (req, res) => {
  try {
    const travelplan = await TravelPlan.findOneAndDelete({
      id: parseInt(req.params.id),
    });
    if (!travelplan) {
      return res.status(404).json({ message: "Travel plan not found" });
    }
    res.json({ message: "Travel plan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
