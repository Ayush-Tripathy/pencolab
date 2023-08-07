const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    connectedUsers: {
        type: [String],
        required: true
    },
    date: {
        type: Date, index: { unique: true, expires: '1d' }, default: Date.now
    },
});

roomSchema.path('date').index({ expires: "1d" });

module.exports = mongoose.model('room', roomSchema);