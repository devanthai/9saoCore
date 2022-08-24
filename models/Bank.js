const mongoose = require('mongoose');

const Tsrr = new mongoose.Schema({
    magd:{
        type:String
    },
    noidung:{
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
    uid:{
        type:Object
    },
    time:{
        type:Date,
        default:Date.now
    },
    change: { type: Boolean, default: false }
})
module.exports = mongoose.model('Bank',Tsrr)