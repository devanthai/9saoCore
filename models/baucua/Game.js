const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    x1: {
        type: Number,
        default: -1
    },
    x2: {
        type: Number,
        default: -1
    },
    x3: {
        type: Number,
        default: -1
    },
    type: {
        type: String
    },
    status: {
        type: Number,
        default: -1
    }
})
GameSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('BaucuaGame', GameSchema)