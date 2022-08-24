const mongoose = require('mongoose');

const codeeeeee = new mongoose.Schema({
    name:{
        type:String
    },
    code:{
        type:String
    },
    phanthuong:{
        type:Number
    },status:{
        type:Number,
        default:0
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Gifcode',codeeeeee)
//dang viet code