const mongoose = require('mongoose');
const Nohu = new mongoose.Schema({
    vanghu: {
        type: Number,
        default: 0
    },
    muccuoc: {
        type: Number,
        require: true
    },
    isBum: {
        type: Boolean,
        default: false
    },
    winner: {
        type: String
    }
})
module.exports = mongoose.model('HuHoaQua', Nohu)