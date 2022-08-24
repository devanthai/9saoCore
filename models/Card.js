const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    code:{
        type:String
    },
    serial:{
        type:String
    },
    loaithe:{
        type:String
    },
    menhgia:{
        type:Number
    },
    amount:{
        type:Number
    },
    status:{
        type:Number,
        default:0
    },
    message:{
        type:String
    },
    server:{
        type:Number
    },
    nhan:{
        type:Number,
        default:0
    },
    requestid:{
        type:String
    },
    uid:{
        type:Object
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Card',CardSchema)