
const mongoose = require('mongoose');
const gt1s = new mongoose.Schema({
    magd: {
        type: String
    },
    sotien: {
        type: Number
    },
    timegt1s: {
        type: String
    },
    name: {
        type: String
    },
    server: {
        type: Number
    },
    tienthang: {
        type: Number
    },
    vangthang: {
        type: Number
    },
    status: {
        type: Number
    },
    noidung: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
})
var Gachthe1s = mongoose.model('clGachthe1s', gt1s);

module.exports = Gachthe1s
