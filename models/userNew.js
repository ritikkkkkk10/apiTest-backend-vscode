const mongoose = require('mongoose');

// Define the User schema
const userNewSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: ['child', 'parent'], required: true },
    userId: { type: String, required: true },
});

module.exports = mongoose.model('UserNew', userNewSchema);