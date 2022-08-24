const mongoose = require('mongoose');

const Rutvang = new mongoose.Schema({
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
        type:String
       
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
    cuocngay:{
        type:String
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('RutThoi',Rutvang)