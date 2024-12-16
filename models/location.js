const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    locationByDate: {
        type: Map,
        of: [
            {
                latitude: { type: Number, required: true },
                longitude: { type: Number, required: true },
                timestamp: { type: Date, required: true }
            }
        ]
    }
});

module.exports = mongoose.model("Location", locationSchema);
