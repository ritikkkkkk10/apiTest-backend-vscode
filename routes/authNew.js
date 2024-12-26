const express = require('express');
const UserNew = require('../models/userNew'); // Ensure the correct path to the model
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const authNewRouter = express.Router();

// Register route
authNewRouter.post('/register', async (req, res) => {
    const { childPhone, parentPhone } = req.body;

    if (!childPhone || !parentPhone) {
        return res.status(400).json({ error: 'Child and parent phone numbers are required' });
    }

    try {
        // Check if either phone number already exists
        const childExists = await UserNew.findOne({ phoneNumber: childPhone });
        const parentExists = await UserNew.findOne({ phoneNumber: parentPhone });

        if (childExists || parentExists) {
            return res.status(400).json({ error: 'One or both phone numbers are already registered' });
        }

        // Create a shared userId
        const userId = uuidv4();

        // Save both child and parent details
        await UserNew.create({ phoneNumber: childPhone, role: 'child', userId });
        await UserNew.create({ phoneNumber: parentPhone, role: 'parent', userId });

        return res.status(201).json({ message: 'Registration successful', userId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Login route
authNewRouter.post('/login', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        const userNew = await UserNew.findOne({ phoneNumber }); // Fix model name from User to UserNew

        if (!userNew) {
            return res.status(404).json({ error: 'Phone number not found' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: userNew.userId, role: userNew.role },
            process.env.JWT_SECRET || 'your_secret_key', // Use an environment variable for the secret
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            userId: userNew.userId,
            role: userNew.role, // Include role in the response
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = authNewRouter;
