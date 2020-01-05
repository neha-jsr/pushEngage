const mongoose = require('mongoose');

//Define Notification model
const Schema = mongoose.Schema;
const NotificationStatsSchema = new Schema({
    siteId: {
        type: String,
        trim: true,
        required: true,
    },
    notificationId: {
        type: String,
        trim: true,
        required: true,
    },
    actionType: {
        type: String,
        trim: true,
        required: true,
    },
    count: {
        type: Number,
        trim: true,
        required: true,
    },
    epochHour: {
        type: Number,
        trim: true,
        required: true,
    }
}, {
    timestamps: true
})

NotificationStatsSchema.index({ siteId: 1, notificationId: -1, epochHour: -1 });

module.exports = mongoose.model('NotificationStats', NotificationStatsSchema);