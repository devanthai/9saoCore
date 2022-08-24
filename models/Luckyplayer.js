const mongoose = require('mongoose');
const Lucky = new mongoose.Schema({
    name:{
        type:String
    },
    vang:{
        type:Number
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Luckyplayer',Lucky)