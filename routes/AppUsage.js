const express = require('express');
const AppUsage = require('../models/AppUsage'); // Import the AppUsage model

const appUsageRouter = express.Router();

// Endpoint to save or update app usage data
appUsageRouter.post('/AppUsage', async (req, res) => {
    const { userId, apps } = req.body;

    try {
        // Check if the user already has app usage data
        let existingAppUsage = await AppUsage.findOne({ userId });

        if (existingAppUsage) {
            // If data exists, update it
            existingAppUsage.apps = apps;
            await existingAppUsage.save();
        } else {
            // If no data exists, create new entry
            const newAppUsage = new AppUsage({ userId, apps });
            await newAppUsage.save();
        }

        res.status(200).json({ message: 'App usage data saved successfully' });
    } catch (err) {
        console.error('Error saving app usage data:', err);
        res.status(500).json({ message: 'Error saving app usage data' });
    }
});

// Endpoint to get app usage data by userId
appUsageRouter.get('/appUsage/:userId', async (req, res) => {
    const { userId } = req.params; // Get userId from the request parameters

    try {
        // Find the app usage data for the user
        const existingAppUsage = await AppUsage.findOne({ userId });

        if (existingAppUsage) {
            res.status(200).json(existingAppUsage); // Return the app usage data as JSON
        } else {
            res.status(404).json({ message: 'App usage data not found for this user' });
        }
    } catch (err) {
        console.error('Error fetching app usage data:', err);
        res.status(500).json({ message: 'Error fetching app usage data' });
    }
});


module.exports = appUsageRouter;
