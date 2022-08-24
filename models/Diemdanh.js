const mongoose = require('mongoose');
const Lucky = new mongoose.Schema({
    name:{
        type:String
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Diemdanh',Lucky)