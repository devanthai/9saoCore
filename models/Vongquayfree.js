const mongoose = require('mongoose');

const vongquay = new mongoose.Schema({
    phanthuong:{
        type:String
    },
    uid:{
        type:Object
    },
    name:{
        type:String
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Vongquayfree',vongquay)