const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({

    ketqua: {
        type: Number,
        default: -1
    },
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
module.exports = mongoose.model('XocDiaGame', GameSchema)