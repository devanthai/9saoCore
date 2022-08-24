const mongoose = require('mongoose');

const ChietKhauSchema = new mongoose.Schema({
    server:{
        type:Number
    },
    vi:{
        type:Number
    },
    card:{
        type:Number
    },
    sms:{
        type:Number,
        default:1500
    }
})
module.exports = mongoose.model('ChietKhau',ChietKhauSchema)