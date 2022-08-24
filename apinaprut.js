const express = require('express');
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userControl = require('./controller/user')
const Napvang = require('./models/Napvang')
const Rutvang = require('./models/Rutvang')
const HisNhapVang = require('./modelsNhapVang/Hisnapvang')
const UserNhapVang = require('./modelsNhapVang/User')
var bodyParser = require('body-parser')
var ObjectId = require('mongoose').Types.ObjectId;

app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }))
app.use(bodyParser.json({ limit: '30mb' }))
dotenv.config()
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, () => console.log('Connected to db'));
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function get3UID(uid) {
    var number3 = ""
    let zNum = ""
    for (let i = uid.length - 1; i >= 0; i--) {
        if (!isNaN(uid[i])) {
            number3 += uid[i]
            zNum++
        }
        if (zNum > 2) {
            break
        }
    }
    return number3
}

app.post('/api/napvang', async (req, res) => {
    const tnv = req.body.tnv
    const server = req.body.server
    const hisnhapvang = await HisNhapVang.findOne({ server: server, nhanvat: tnv, status: -1 })
    if (hisnhapvang) {
        // const hisnhapvang2 = await HisNhapVang.find({ server: server, nhanvat: tnv, status: -1 })
        // if (hisnhapvang2.length > 1) {
        //     await HisNhapVang.deleteMany({ server: server, nhanvat: tnv, status: -1 })
        //     return res.send("khongco")
        // }
        // else {
        return res.send(hisnhapvang._id + "|" + hisnhapvang.sovang)
        //  }
    }
    else {
        const lsvang = await Napvang.findOne({ server: server, status: 0, tnv: tnv })
        if (lsvang) {
            //     var uid3 = get3UID(lsvang.uid)
            return res.send(lsvang._id + "|" + lsvang.sovang)
        }
        else {
            return res.send("khongco")
        }
    }
})
app.post('/api/rutvang', async (req, res) => {
    const tnv = req.body.tnv
    const server = req.body.server
    const rutvangg = await Rutvang.findOne({ server: server, tnv: tnv, status: 0 })
    if (rutvangg) {
        var timezzz = timeSinceeee(rutvangg.time);
        if (timezzz > 800) {
            return res.send("khongco")
        }
        else {
            return res.send(rutvangg._id + "|" + rutvangg.sovang)
        }
    }
    else {
        return res.send("khongco")
    }
})

app.post('/api/donenap', async (req, res) => {
    const id = req.body.id
    const tnv = req.body.tnv
    const truocgd = req.body.truocgd
    const saugd = req.body.saugd
    const hisnhapvang = await HisNhapVang.findOneAndUpdate({ _id: ObjectId(id), status: -1 }, { status: 1, namebot: tnv, last: truocgd, now: saugd })
    if (hisnhapvang) {
        await UserNhapVang.findByIdAndUpdate(hisnhapvang.uid, { $inc: { vang: hisnhapvang.sovang } });
        return res.send("thanhcong")
    }
    else {
        const lsvang = await Napvang.findOneAndUpdate({ _id: ObjectId(id), status: 0 }, { status: 1, botgd: tnv, truocgd: truocgd, saugd: saugd })
        if (lsvang) {
            const user = await userControl.upMoney(lsvang.uid, lsvang.sovang)
            if (user) {
                const sodu = await userControl.sodu(lsvang.uid, "+" + numberWithCommas(lsvang.sovang), "Nạp vàng")
                return res.send("thanhcong")
            }
        }
        else {
            return res.send("thatbai")
        }
    }
})
app.post('/api/donerut', async (req, res) => {
    const tnv = req.body.tnv
    const id = req.body.id
    const truocgd = req.body.truocgd
    const saugd = req.body.saugd
    try {

        const lsvang = await Rutvang.findOneAndUpdate({ _id: id, status: 0 }, { status: 1, botgd: tnv, truocgd: truocgd, saugd: saugd })
        if (lsvang) {
            return res.send("thanhcong")
        }
        else {
            return res.send("thatbai")
        }
    } catch { return res.send("thanhcong") }

})

function timeSinceeee(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds)
}

const server = require('http').createServer(app);
server.listen(56783, () => console.log('Server Running on port 56783'));