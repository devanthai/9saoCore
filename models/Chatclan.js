const mongoose = require('mongoose');

const chatclan = new mongoose.Schema({
    noidung:{
        type:String
    },
    type:{
        type:Number
    },
    admin:{
        type:Number
    },
    name:{
        type:String
    },sodu:{
        type:Number
    }
    ,uidclan:{
        type:Object
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Chatclan',chatclan)