const mongoose = require('mongoose');
const Napvang = new mongoose.Schema({
    server:{
        type:Number
    },
    nhanvat:{
        type:String
    },
    taikhoan:{
        type:String
    },
    sovang:{
        type:Number
    },
    namebot:{
        type:String
    },
    status:{
        type:Number,
        default:-1
    },
    uid:{
        type:String
    },
    last:{
        type:Number
    },
    now:{
        type:Number
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Napvangthoi',Napvang)