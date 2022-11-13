const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    phien: {
        type: String
    },
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
    vangdat: {
        type: Number
    },
    vangnhan: {
        type: Number,
        default: -1
    },
    uid: {
        type: Object
    },
    nhanvat: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String
    },
    status: {
        type: Number,
        default: -1
    },
    ip: {
        type: String,
    }
})
module.exports = mongoose.model('TaiXiuCuoc', GameSchema)