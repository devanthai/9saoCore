const mongoose = require('mongoose');

const chuyentien = new mongoose.Schema({
    nguoinhan:{
        type:Object
    },
    nguoigui:{
        type:Object
    },
    noidung:{
        type:String
    },
    tenchuyen:{
        type:String
    },
    tennhan:{
        type:String
    },
    status:{
        type:String
    },
    sovang:{
        type:Number
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Chuyentien',chuyentien)