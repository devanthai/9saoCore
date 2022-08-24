const mongoose = require('mongoose');
const Nohu = new mongoose.Schema({
    vanghu:{
        type:Number,
        default:0
    },
    lastwin:{
        type:Array,
        default:[]
    },
    nowpart:{
        type:Array,
        default:[]
    }
})
module.exports = mongoose.model('Nohu',Nohu)