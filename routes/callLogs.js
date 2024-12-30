const express = require('express');
const callRouter = express.Router();
const Calls = require('../models/calls'); // Import the Calls model

// Post route to save logs
callRouter.post('/saveCallLogs', async (req, res) => {
    const { userId, callLogs } = req.body;

    try {
        let userr = await Calls.findOne({ userId: userId });

        if (!userr) {
            userr = new Calls({
                userId: userId,
                callLogs: callLogs,
                calllogssavingstime: new Date().toISOString(),
            });
            await userr.save();
            return res.status(201).json({ message: "User created and call logs saved successfully" });
        }

        // If a record exists, check for the last saved timestamp
        const lastSavedTime = userr.calllogssavingstime
            ? new Date(userr.calllogssavingstime)
            : null;

        // Log the UTC last saved time
        if (lastSavedTime) {
            console.log("Last Saved Time (UTC):", lastSavedTime.toISOString());
        }

        // Filter the new call logs by the timestamp in UTC
        const newCallLogs = callLogs.filter(log => {
            const logTime = new Date(log.callDate).getTime(); // Convert callDate to timestamp (UTC)
            const lastSavedTimeUTC = lastSavedTime ? lastSavedTime.getTime() : 0;
            // Compare the log time (UTC) with lastSavedTime (UTC)
            return logTime > lastSavedTimeUTC;
        });

        // Add only the new logs to the database
        if (newCallLogs.length > 0) {
            userr.callLogs.push(...newCallLogs); // Only add new call logs
            userr.calllogssavingstime = new Date().toISOString(); // Update the saving time
            await userr.save();

            res.status(200).json({
                message: "Call logs saved successfully",
                newLogsSaved: newCallLogs.length,
            });
        } else {
            res.status(200).json({
                message: "No new call logs to save",
                newLogsSaved: 0,
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while saving call logs" });
    }
});

// Get route to fetch call logs for a user
callRouter.get('/getCallLogs/:userId/:date', async (req, res) => {
    const { userId, date } = req.params;

    try {
        // Find the user's call logs by userId
        const userr = await Calls.findOne({ userId: userId });

        if (!userr) {
            return res.status(404).json({ message: "No call logs found for this userId" });
        }

        // Filter call logs for the specific date
        const filteredLogs = userr.callLogs.filter(log => log.callDate.startsWith(date));

        if (filteredLogs.length === 0) {
            return res.status(404).json({ message: "No call logs found for the selected date" });
        }

        res.status(200).json({
            message: "Call logs fetched successfully",
            callLogs: filteredLogs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching call logs" });
    }
});

module.exports = callRouter;









