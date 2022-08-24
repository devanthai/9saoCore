const mongoose = require('mongoose');

const idddd = new mongoose.Schema({
    ip:{
      type:String
    }
   
})
module.exports = mongoose.model('ipblock',idddd)
