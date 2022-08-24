const mongoose = require('mongoose');

const botrut = new mongoose.Schema({
    map:{
        type:String
    },
    server:{
        type:Number
    },
    khu:{
        type:Number
    },
    tnv:{
        type:String
    },
    sovang:{
        type:Number
    },
    taikhoan:{
        type:String
    }
})
module.exports = mongoose.model('Botrut',botrut)