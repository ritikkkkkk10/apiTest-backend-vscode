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

router.get("/location", async(req, res) => {
    const { userId, date, startTime, limit = 10, offset = 0 } = req.query;

    try {
        const userLocation = await Location.findOne({ userId});

        if(userLocation) {
            const locationsForDate = userLocation.locationByDate.get(date);
            if(locationsForDate) {
                const filteredLocations = locationsForDate
                .filter(loc => new Date(loc.timestamp) > new Date(startTime))
                .slice(Number(offset), Number(offset) + Number(limit));

                return res.status(200).json(filteredLocations);
            }
        }
        res.status(404).json({ message: "No locations found for the given date and time"});
    } catch (err) {
        console.error("Error fetching locations:", err);
        res.status(500).json({message: "Failed to fetch locations"});
    }
});

module.exports = router;
