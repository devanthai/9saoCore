const mongoose = require('mongoose');

const idddd = new mongoose.Schema({
    tnv:{
      type:String
    }
   
})
module.exports = mongoose.model('Idnaprut',idddd)
//dang viet code