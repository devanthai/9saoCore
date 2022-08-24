const mongoose = require('mongoose');

const Clan = new mongoose.Schema({
    name:{
        type:String
    },
    khauhieu:{
        type:String
    },
    thanhtich:{
        type:Number,
        default:0
    },
    uid:{
        type:Object
    }, 
    type:{
        type:Number
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Clan',Clan)