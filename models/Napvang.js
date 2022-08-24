const mongoose = require('mongoose');

const Napvangg = new mongoose.Schema({
    uid:{
        type:Object
    },
    server:{
        type:Number
    },
    sovang:{
        type:Number
    },
    status:{
        type:Number,
        default:0
    },
    tnv:{
        type:String
    },
    taikhoan:{
        type:String,
       
    },
    botgd:{
        type:String
    },
    truocgd:{
        type:Number
    },
    saugd:{
        type:Number
        
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Napvang',Napvangg)