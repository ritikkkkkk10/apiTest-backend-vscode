const express = require("express");
const Location = require("../models/location"); // Import the Location model
const router = express.Router();

// Endpoint to update or save location data
router.post("/location", async (req, res) => {
    const { userId, latitude, longitude, timestamp } = req.body;

    try {
        // Format the timestamp to only include the date part (e.g., "2024-12-16")
        const dateKey = new Date(timestamp).toISOString().split("T")[0];

        // Find the user's location document
        let userLocation = await Location.findOne({ userId });

        if (userLocation) {
            // Check if the date key already exists in locationByDate
            if (userLocation.locationByDate.has(dateKey)) {
                // Append the new location to the array for that date
                userLocation.locationByDate.get(dateKey).push({ latitude, longitude, timestamp });
            } else {
                // Create a new array for the date
                userLocation.locationByDate.set(dateKey, [{ latitude, longitude, timestamp }]);
            }
        } else {
            // Create a new document if no data exists for the user
            userLocation = new Location({
                userId,
                locationByDate: {
                    [dateKey]: [{ latitude, longitude, timestamp }]
                }
            });
        }

        // Save the updated or new document
        await userLocation.save();

        res.status(200).json({ message: "Location saved successfully" });
    } catch (err) {
        console.error("Error saving location:", err);
        res.status(500).json({ message: "Failed to save location" });
    }
});

module.exports = router;
