const mongoose = require('mongoose');

const LocationPermissionSchema = new mongoose.Schema({
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true })

LocationPermissionSchema.index({ locationId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('LocationPermission', LocationPermissionSchema);
