const mongoose = require('mongoose');
const bot = new mongoose.Schema({
    TypeBot: {
        type: Number
    },
    Server: {
        type: Number
    },
    Zone: {
        type: Number
    },
    Name: {
        type: String,
        default: "Chưa vào game"
    },
    Gold: {
        type: Number,
        default: 0
    },
    Username: {
        type: String
    },
    Password: {
        type: String
    },
    ToaDoX: {
        type: Number
    },
    ToaDoY: {
        type: Number
    },
    Status: {
        type: Number,
        default: -1
    },
    CodeVps: {
        type: String,
        default: "null"
    },
    IpVps: {
        type: String,
        default: "null"
    },
    Version: {
        type: String,
        default: "1.6.6"
    },
    TimeLastOnline: { type: Date },
    createdAt: { type: Date, default: Date.now }

}, { timestamps: true })
module.exports = mongoose.model('BotThoi', bot)