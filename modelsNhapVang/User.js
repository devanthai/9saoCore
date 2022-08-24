const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:1024
    },
    server:{
        type:Number,
        required:true
    },
    vang:{
        type:Number,
        default:0
    },
    vangrut:{
        type:Number,
        default:0
    },
    vangnap:{
        type:Number,
        default:0
    },
    tienrut:{
        type:Number,
        default:0
    },
    date:{
        type:Date,
        default:Date.now
    }
    
})
module.exports = mongoose.model('Usernhap',userSchema)