const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide content name'],
        maxlength: [100, 'Your content name must not exceed 100 characters']
    },
    location: {
        type: String,
        require: [true, 'Please provide content location']
    },
    processId: {
        type: String,
        required: [true, 'Please provide process id']
    },
    fallback: {
        type: String
    },
    uploaded: {
        type: Boolean,
        default: false
    },
    encoded: {
        type: Boolean,
        default: false
    },
    progress: {
        type: Number,
        default: 0
    },
    status: {
        type: String
    },
    approved: {
        type: Boolean,
        default: false
    }
})

contentSchema.pre('save', async function (next) {
    if (!this.isModified('progress')) { next() }
    //emit socketio
})

module.exports = mongoose.model('Content', contentSchema)