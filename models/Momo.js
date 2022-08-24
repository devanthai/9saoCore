const mongoose = require('mongoose');

const Tsrr = new mongoose.Schema({
    magd:{
        unique:true,
        type:String
    },
    name:{
        type:String
    },
    sdt:{
        type:String
    },
    sotien:{
        type:Number
    },
    thucnhan:{
        type:Number
    },
    status:{
        type:String
    },
    timemomo:{
        type:String
    },
    uid:{
        type:Object
    },
    time:{
        type:Date,
        default:Date.now
    },
    change: { type: Boolean, default: false }
})
module.exports = mongoose.model('Momo',Tsrr)