const mongoose = require('mongoose');

const GameKeno = new mongoose.Schema({
    game:{
        type:Object,
        required: true
    },
    status:{
        type:Number,
        default:0
    },
    vangchan:{
        type:Number,
        default:0
    },
    vangle:{
        type:Number,
        default:0
    },
    vangtai:{
        type:Number,
        default:0
    },
    vangxiu:{
        type:Number,
        default:0
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Gamekeno',GameKeno)