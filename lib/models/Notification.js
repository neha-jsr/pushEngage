const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Define Notification model
const NotificationSchema = new Schema({
    siteId: {
        type: String,
        trim: true,
        required: true,
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    type: {
        type: Number,
        trim: true,
        required: true,
    },
    icon: {
        type: String,
        trim: true,
        required: true,
    },
    require_interaction: {
        type: String,
        trim: true,
        required: true,
    },
    imageUrl1: {
        type: String,
        trim: true,
        required: false,
    },
    imageUrl2: {
        type: String,
        trim: true,
        required: false,
    },
    bannerType: {
        type: String,
        trim: true,
        required: false,
    },
    bannerUrl: {
        type: String,
        trim: true,
        required: false,
    },
    message: {
        type: String,
        trim: true,
        required: true,
    },
    actionButtonText1: {
        type: String,
        trim: true,
        required: false,
    },
    actionButtonText2: {
        type: String,
        trim: true,
        required: false,
    },
    targetUrl: {
        type: String,
        trim: true,
        required: true,
    },
    targetUrl1: {
        type: String,
        trim: true,
        required: false,
    },
    targetUrl2: {
        type: String,
        trim: true,
        required: false,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Notification', NotificationSchema);