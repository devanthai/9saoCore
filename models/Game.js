const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  
    status:{
        type:Number,
        default:0
    },
    ketqua:{
        type:Number,
        default:-1
    },
    ketquatruoc:{
        type:Number,
        default:-1
    },
    server:{
        type:Number,
        required:true
    },
    time:{
        type:Number,
        required:true
    },
    vangchan:{
        type:Number,
        default:0
    },
    vangle:{
        type:Number,
        default:0
    },
    vangtai:{
        type:Number,
        default:0
    },
    vangxiu:{
        type:Number,
        default:0
    },
    timeCsmm:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
})
module.exports = mongoose.model('Game',GameSchema)