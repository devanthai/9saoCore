const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    avatar:{
        type:String
    },
    name:{
        type:String
    },
    icon:{
        type:String
    },
    noidung:{
        type:String
    },
    sodu:{
        type:String
    },
    type:{
        type:Number,
        default:-1
    },
    server:{
        type:Number
    },
    uid:{
        type:Object
    },
    token:{
        type:String
    },
    time:{
        type:Date,
        default:Date.now
    },
    clan:{
        type:Number
    },
    vip:{
        type:Number
    },
    top:{
        type:Number
    }
})
module.exports = mongoose.model('Chat',ChatSchema)