const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true
    },
    lastX: {
        type: Number,
        required: true
    },
    lastY: {
        type: Number,
        required: true
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    lineWidth: {
        type: String,
        required: true
    },
    isErasing: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date, index: { unique: true, expires: '1d' }, default: Date.now
    },
});

drawingSchema.path('date').index({ expires: '1d' });

module.exports = mongoose.model('drawing', drawingSchema);