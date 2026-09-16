const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Location', LocationSchema);
