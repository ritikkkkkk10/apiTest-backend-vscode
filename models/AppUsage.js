const mongoose = require('mongoose');

const appUsageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    apps: [
        {
            name: { type: String, required: true },
            usageDuration: { type: String, required: true },
            launchCount: { type: Number, required: true },
            activeTimesByDay: { type: Map, of: [String] }
        }
    ]
});

const AppUsage = mongoose.model('AppUsage', appUsageSchema);

module.exports = AppUsage;
