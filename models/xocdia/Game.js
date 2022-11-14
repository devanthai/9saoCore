const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    ketqua: {
        type: String
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
    x4: {
        type: Number,
        default: -1
    },
   
    status: {
        type: Number,
        default: -1
    }
})
module.exports = mongoose.model('XocDiaGame', GameSchema)