const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
mongoose.connect(process.env.DB_CONNECT, {}, () => console.log('Connected to db'));
const hisNapThoi = require('./models/Napthoi')
const hisNapvang = require('./models/Napvang')


function secondSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds)
}


setInterval(async () => {
    let napthois = await hisNapThoi.find({ status: 0 })
    let napvangs = await hisNapvang.find({ status: 0 })
    for (let thoi of napthois) {
        if (secondSince(thoi.time) > 300) {
            await hisNapThoi.deleteOne({ _id: thoi._id})
            console.log("rm "+thoi._id)

        }
    }
    for (let vang of napvangs) {
        if (secondSince(vang.time) > 300) {
            await hisNapvang.deleteOne({ _id: vang._id})
            console.log("rm "+vang._id)
        }
    }
}, 10000);