const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    phien:{
        type:String
    },
    server:{
        type:Number
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
        type:Number
    },
    chon:{
        type:Number
    },
    status:{
        type:Number,
        default:-1
    },
    bot:{
        type:Boolean,
        default: false
    },
    ip:{
        type:String,
    }
})
GameSchema.index({time:-1});
module.exports = mongoose.model('Cuoc',GameSchema)