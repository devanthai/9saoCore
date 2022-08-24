const mongoose = require('mongoose');

const Napvangg = new mongoose.Schema({
    money:{
        type:Number
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('MoneyChange',Napvangg)