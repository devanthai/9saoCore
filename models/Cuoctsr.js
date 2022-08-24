const mongoose = require('mongoose');

const Cuockeno = new mongoose.Schema({
    taikhoan:{
        type:String
    },
    name :{
        type:String
    },
    magd :{
        type:String
    },
    tiencuoc:{
        type:Number
    },
    tienthang:{
        type:Number,
        default:0
    },
    trochoi :{
        type:String
    },
    noidung :{
        type:String
    },
    status :{
        type:Number,
        default:0
    },
    time:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model('Cuoctsr',Cuockeno)