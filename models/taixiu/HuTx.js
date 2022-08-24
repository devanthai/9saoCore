const mongoose = require('mongoose');
const Nohu = new mongoose.Schema({
    vanghu: {
        type: Number,
        default: 0
    },
    playerWin: {
        type: Object,
        default:null
    },
    time: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('HuTx', Nohu)