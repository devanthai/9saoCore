const mongoose = require('mongoose');

const botvang = new mongoose.Schema({
    server:{
        type:Number
    },
    vang:{
        type:Number
    },
    khu:{
        type:Number
    },
    tnv:{
        type:String
    },
    type:{
        type:String
    }
})
module.exports = mongoose.model('Botvang',botvang)