const express = require('express')
const app = express()

const md5 = require('md5');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Card = require('./models/Card')
const User = require('./models/User')
const userControl = require('./controller/user')
const Chietkhau = require('./models/ChietKhau')
const Setting = require('./models/Setting')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }))
app.use(bodyParser.json({ limit: '30mb' }))
dotenv.config()
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('Connected to db'));
//mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, () => console.log('Connected to db'));

//redisssssssssssssssssssssssssssssssssssssssss
const redisClient = require("./redisCache")
//redisssssssssssssssssssssssssssssssssssssssss


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
app.post('/', async (req, res) => {
    const setting = await Setting.findOne({ setting: "setting" })
    console.log(req.body)



    const { code, serial, partner_key, callback_sign, status, message, request_id, trans_id, declared_value, value, amount, telco } = req.body



    const callbacksign = md5(partner_key + code + "charging" + setting.cardsetting.partnerid + request_id + serial + telco)

    // const callbacksign = md5(partner_key + code + serial)

    console.log(callbacksign + "|" + callback_sign, callback_sign == callbacksign)
    // console.log(callback_sign == callbacksign)
    //if (callback_sign == callbacksign) {

    if (status == 100) {
        //k xac dinh
        const ccc = await Card.findOneAndUpdate({ requestid: request_id, status: 0 }, { message: message, status: 2 })
    }
    else if (status == 1) {

        //thanh cong
        let zzzzzzz = await Card.findOne({ requestid: request_id.toString() })//, "status": 0 })
        if (!zzzzzzz) {
            zzzzzzz = await Card.findOne({ code: code.toString(), serial: serial.toString(), "status": 0 })
        }
        if (zzzzzzz) {
            try {
                redisClient.publish("addAmountVip", JSON.stringify({ uid: zzzzzzz.uid, value: value }))
            }
            catch {

            }
            const user = await User.findById(zzzzzzz.uid)
            if (user) {
                // console.log(user)
                const chietkhau = await Chietkhau.findOne({ server: user.server })
                if (chietkhau) {
                    var vangcong = 0;
                    if (value >= 50000) {
                        vangcong = (value * chietkhau.card) + getRandomIntInclusive(2000000, 10000000)
                    }
                    else {
                        vangcong = (value * chietkhau.card)
                    }
                    const zxcas = await Card.findOneAndUpdate({ requestid: request_id, status: 0 }, { message: message, status: 1, nhan: vangcong })
                    const caaaa = await userControl.topup(zzzzzzz.uid, declared_value)
                    const cccc = await userControl.upMoney(zzzzzzz.uid, vangcong)
                    const cccczz = await userControl.upKimcuong(zzzzzzz.uid, value / setting.tile.kimcuong)
                    const sodu = await userControl.sodu(zzzzzzz.uid, "Nạp thẻ cào", "+" + numberWithCommas(vangcong))

                }
            }
            else {
                console.log("ktim thay user")
            }
        }
        else {
            console.log(
                "ktim thay the"
            )
        }
    }
    else if (status == 2) {
        //the sai
        const ccc = await Card.findOneAndUpdate({ requestid: request_id, status: 0 }, { message: message, status: 2 })
    }
    else if (status == 3) {
        //the k dung dc
        const ccc = await Card.findOneAndUpdate({ requestid: request_id, status: 0 }, { message: message, status: 2 })
    }
    else if (status == 99) {
        const ccc = await Card.findOneAndUpdate({ requestid: request_id, status: 0 }, { message: message, status: 1 })
        //cho xu ly
    }
    //}
    res.send("ccc")
})
app.get('/', (req, res) => {
    res.send("aduvip")
})
const server = require('http').createServer(app);
server.listen(20020, () => console.log('Server Running on port 20020'));