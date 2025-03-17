const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // For making API requests

const app = express();
const PORT = 5000; // Run backend on port 5000

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

const GOOGLE_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API Key

// API Route to fetch nearby police stations
app.get("/api/nearby-police", async (req, res) => {
  const { lat, lng } = req.query; // Get latitude and longitude from request

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  const googlePlacesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=police&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(googlePlacesUrl);
    const data = await response.json();
    res.json(data); // Send the data back to frontend
  } catch (error) {
    console.error("Error fetching police stations:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
