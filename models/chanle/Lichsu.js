const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    phien:{
        type:String
    },
    ketqua:{
        type:Number,
        default:-1
    },
    vangdat:{
        type:Number
    },
    vangnhan:{
        type:Number,
        default:-1
    },
    uid:{
        type:Object
    },
    nhanvat:{
        type:String
    },
    time:{
        type:Date,
        default:Date.now
    },
    type:{
        type:String
    },
   
    status:{
        type:Number,
        default:-1
    }
})
module.exports = mongoose.model('LichSuChanLe',GameSchema)