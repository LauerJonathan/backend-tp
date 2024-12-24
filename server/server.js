const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from a .env file

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for all routes
app.use(express.json()); // Parse incoming JSON requests

// MongoDB Configuration
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/agcDashboard") // Connect to the MongoDB database using the URI from environment variables or a fallback local URI
  .then(() => console.log("Connected to MongoDB")) // Log successful connection
  .catch((err) => console.error("Error connecting to MongoDB:", err)); // Handle and log connection errors

// Define a Mongoose schema for the Travel Plan
const travelPlanSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    default: "#ffb268", // Default color for the plan
  },
  days: {
    type: [String], // Array of strings representing days
    default: [], // Default is an empty array
  },
  font: {
    type: String,
    required: true,
    default: "Arial", // Default font for the plan
  },
  id: {
    type: Number,
    required: true, // Unique identifier for the plan
  },
  name: {
    type: String,
    required: true,
    default: "Rome", // Default name for the travel plan
  },
  notes: {
    type: [String], // Array of strings for notes
    default: [], // Default is an empty array
  },
  textColor: {
    type: String,
    required: true,
    default: "#000000", // Default text color for the plan
  },
});

const TravelPlan = mongoose.model("TravelPlan", travelPlanSchema); // Create a Mongoose model using the schema

// Routes

// GET - Retrieve all travel plans
app.get("/api/travelplan", async (req, res) => {
  try {
    const travelplans = await TravelPlan.find(); // Fetch all travel plan documents
    res.json(travelplans); // Respond with the list of travel plans in JSON format
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle and respond with server errors
  }
});

// GET - Retrieve a specific travel plan by ID
app.get("/api/travelplan/:id", async (req, res) => {
  try {
    const travelplan = await TravelPlan.findById(req.params.id); // Find travel plan by ID
    if (!travelplan) {
      return res.status(404).json({ message: "Travel plan not found" }); // Return 404 if plan doesn't exist
    }
    res.json(travelplan); // Respond with the found travel plan
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle and respond with server errors
  }
});

// POST - Create a new travel plan
app.post("/api/travelplan", async (req, res) => {
  const travelplan = new TravelPlan(req.body); // Create a new travel plan instance with the request body
  try {
    const newTravelplan = await travelplan.save(); // Save the plan to the database
    res.status(201).json(newTravelplan); // Respond with the created plan and a 201 status
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle and respond with validation or client errors
  }
});

// PUT - Update an existing travel plan
app.put("/api/travelplan/:id", async (req, res) => {
  try {
    const travelplan = await TravelPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
      }
    );
    res.json(travelplan); // Respond with the updated travel plan
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle and respond with client errors
  }
});

// DELETE - Delete a travel plan
app.delete("/api/travelplan/:id", async (req, res) => {
  try {
    await TravelPlan.findByIdAndDelete(req.params.id); // Delete the plan by ID
    res.json({ message: "Travel plan deleted" }); // Respond with a confirmation message
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle and respond with server errors
  }
});

// Start the server
const PORT = process.env.PORT || 5001; // Use the port from environment variables or a default port (5001)
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // Log that the server is running
});
