const router = require('express').Router()
const md5 = require('md5');
const Card = require('../../models/Card')
const User = require('../../models/User')
const userControl = require('../../controller/user')
const Chietkhau = require('../../models/ChietKhau')
const Setting = require('../../models/Setting')
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
router.post('/', async (req, res) => {
    const setting = await Setting.findOne({ setting: "setting" })
    const code = req.body.code
    const serial = req.body.serial
    const partner_key = setting.cardsetting.partnerkey;
    const callbacksign = md5(partner_key + code + serial)
    const callback_sign = req.body.callback_sign
   // console.log(callbacksign + "|" + callback_sign)
    if (callback_sign == callbacksign) {
        const status = req.body.status
        const message = req.body.message
        const request_id = req.body.request_id
        const trans_id = req.body.trans_id
        const declared_value = req.body.declared_value
        const value = req.body.value
        const amount = req.body.amount
        const telco = req.body.telco
        if (status == 100) {
            //k xac dinh
            const ccc = await Card.findOneAndUpdate({ requestid: request_id, status: 0 }, { message: message, status: 2 })
        }
        else if (status == 1) {
            //thanh cong
            const ccc = await Card.findOne({ requestid: request_id, status: 0 })
            if (ccc) {
                const user = await User.findById(ccc.uid)
                if (user) {
                    // console.log(user)
                    const chietkhau = await Chietkhau.findOne({ server: user.server })
                    if (chietkhau) {
                        var vangcong=0;
                        if (value >= 50000) {
                             vangcong = (value * chietkhau.card) + getRandomIntInclusive(2000000, 10000000)
                        }
                        else{
                            vangcong = (value * chietkhau.card)
                        }
                        const zxcas = await Card.findOneAndUpdate({ requestid: request_id, status: 0 }, { message: message, status: 1, nhan: vangcong })
                        const caaaa = await userControl.topup(ccc.uid, declared_value)
                        const cccc = await userControl.upMoney(ccc.uid, vangcong)
                        const cccczz = await userControl.upKimcuong(ccc.uid, value / setting.tile.kimcuong)
                        const sodu = await userControl.sodu(ccc.uid, "Nạp thẻ cào", "+" + numberWithCommas(vangcong))
                    }
                }
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
    }
    res.send("ccc")
})
router.get('/', (req, res) => {
    res.send("cccc")
})
module.exports = router