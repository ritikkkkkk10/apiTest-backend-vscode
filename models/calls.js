const mongoose = require('mongoose');

//CallLogInfo Schema
const callLogSchema = new mongoose.Schema({
    contactName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    callType: { type: String, required: true },
    callDate: { type: String, required: true },
    callDuration: { type: String, required: true }
});

// User schema with callLogs field
const callSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    callLogs: [callLogSchema], // Embed the call logs for the user
    calllogssavingstime: { type: String } // ISO date string
});

const Calls = mongoose.model('Calls', callSchema);

module.exports = Calls;