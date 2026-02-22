const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    // Unique ID from the job board (prevents duplicates)
    guid: { type: String, unique: true, required: true },

    title: String,
    company: String,
    link: String,
    description: String, // We store this to re-analyze if needed
    source: String, // e.g., "WeWorkRemotely"

    // The Brain's Analysis
    aiAnalysis: {
        isMatch: Boolean,
        reason: String,
        confidence: Number, // 0-100 score
    },

    // Your Workflow Status
    status: {
        type: String,
        enum: ['NEW', 'APPLIED', 'SAVED', 'IGNORED'],
        default: 'NEW',
    },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', JobSchema);
