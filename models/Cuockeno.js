const mongoose = require('mongoose');

const Cuockeno = new mongoose.Schema({
    phien:{
        type:Object
    },
    ky:{
        type:String
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
    }
})
module.exports = mongoose.model('Cuockeno',Cuockeno)