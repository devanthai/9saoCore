const User = require('../models/User')
const Usercontrol = require('./user')
const Cuockeno = require('../models/Cuockeno')
const Cuoctx = require("../models/taixiu/Lichsu")
const CuocChanle = require("../models/chanle/Lichsu")
const CuocBauCua = require("../models/baucua/Lichsu")
var ObjectId = require('mongoose').Types.ObjectId;
const router = require('express').Router()
const Rutvang = require('../models/Rutvang')
const Setting = require('../models/Setting')


const BotGold = require('../models/BotGold')


const Cuoc = require('../models/Cuoc')
const bcrypt = require('bcryptjs')
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');

const CaptchaFunction = require('./CaptchaFunction');

const clientRedis = require("../redisCache")

//const token = '2049064794:AAHWuEwkAZFQBmUEdxGKezBeds-QCZNevqY';
// const token = '2016858249:AAFcUv4Ury7ZZgto7zkigFBhGWDx-wwGT2U'; //test
// const bot = new TelegramBot(token, { polling: true });

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     console.log(msg)
//     if (msg.text == "up" || msg.text == "Up") {
//         bot.sendMessage(-591908464, "Up Cmm " + msg.chat.last_name + " " + msg.chat.first_name);
//     }


//     //console.log(chatId)
// });

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getStatus(status) {

    return (status == 0 ? '<span class="badge badge-warning text-white">Chưa giao dịch</span>' : (status == 1 ? '<span class="badge badge-success text-white">Giao dịch thành công</span>' : '<span class="badge badge-danger text-white">Đã hủy</span>'))
}

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds)
}
router.get('/rutvang', async (req, res) => {
    var page = "pages/user/rutvang";
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    var setting = await Setting.findOne({ setting: "setting" })
    var sssss = "server" + req.user.server
    const getRutvang = await Rutvang.find({ uid: req.user._id }).sort({ 'time': -1 });
    const getBotrut = await BotGold.find({ Server: req.user.server, TypeBot: 2, Status: { $ne: -1 } })


    res.render("index", { page: page, data: req.user, lsrut: getRutvang, botrut: getBotrut, setting: setting, ishanmuc: setting.hanmuc[sssss] });
});
const keyRutvangz = "keyRutvang"
router.post('/rutvang', async (req, res) => {
    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng đăng nhập" });
    }

    // var checkCaptcha = await CaptchaFunction.checkCaptcha(req.body.captcha, req.session.captcha);
    // if (!checkCaptcha) {

    //     return res.send({ error: 1, message: "<strong>Thất bại: </strong> Bạn đã nhập sai captcha!" })
    // }


    const keyrutVang = keyRutvangz + req.user._id
    const getRedis = await clientRedis.get(keyrutVang)
    if (getRedis == "dangrutvang") {
        setTimeout(async () => {
            await clientRedis.del(keyrutVang)
        }, 4000)
        return res.send({ error: 1, message: "<strong>Thất bại: </strong> Quá trình đang thực hiện vui lòng thử lại sau!" })
    }
    await clientRedis.set(keyrutVang, "dangrutvang")


    if (req.body.rutvang) {
        const name = req.body.tnv;
        const type = req.body.type;
        const gold = req.body.gold;
       // const password = req.body.password
        //  console.log(password)
        var gold2 = 0;

        var vang2 = Number(gold.replace(/,/g, ''))
        var nameee = name.toLowerCase().match(/([0-9]|[a-z]|[A-Z])/g);

        var cuocszz = await Cuoc.findOne({ uid: req.user._id, status: -1 })
        var cuoctxszz = await Cuoctx.findOne({ uid: req.user._id.toString(), status: -1 })
        var cuocchanle = await CuocChanle.findOne({ uid: req.user._id.toString(), status: -1 })
        var cuocbaucua = await CuocBauCua.findOne({ uid: req.user._id.toString(), status: -1 })
        // var cuockenozz = await Cuockeno.findOne({ uid: req.user._id, status: -1 })
        var setting = await Setting.findOne({ setting: "setting" })

        if (cuocszz || cuoctxszz || cuocchanle || cuocbaucua) {
            await clientRedis.del(keyrutVang)
            return res.send({ error: 1, message: "Không thể rút khi đang cược" });
        }
        else if (type != 0 && type != 1 && type != 2 && type != 3 && type != 4 && type != 5 && type != 6) {
            await clientRedis.del(keyrutVang)
            return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng nhập đầy đủ thông tin" });
        }
        else if (name == '' || type == '') {
            await clientRedis.del(keyrutVang)
            return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng nhập đầy đủ thông tin" });
        }
        else if (isNaN(vang2)) {
            await clientRedis.del(keyrutVang)
            return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng nhập đầy đủ thông tin" });
        }
        else {
            if (type == 0) gold2 = 10000000;
            if (type == 1) gold2 = 20000000;
            if (type == 2) gold2 = 50000000;
            if (type == 3) gold2 = 100000000;
            if (type == 4) gold2 = 200000000;
            if (type == 5) gold2 = 500000000;

            if (type == 6) gold2 = vang2;
            if (nameee.length != name.length) {
                await clientRedis.del(keyrutVang)
                return res.json({ error: 1, message: "<strong>Thất bại: </strong> Tên nhân vật không hợp lệ" });
            }

            if (gold2 > 500000000) {
                await clientRedis.del(keyrutVang)
                return res.json({ error: 1, message: "<strong>Thất bại: </strong> Số vàng tối đa 1 lần là 500,000,000 vàng !!!" });
            }
            if (gold2 < 10000000) {
                await clientRedis.del(keyrutVang)
                return res.json({ error: 1, message: "<strong>Thất bại: </strong> Số vàng tối thiểu 1 lần là 10,000,000 vàng !!!" });
            }

            const user = await User.findOne({ _id: req.user._id })

            // if (password < 6) {
            //     await clientRedis.del(keyrutVang)
            //     return res.json({ error: 1, message: "<strong>Thất bại!</strong> Mật khẩu phải là 1 chuỗi kí tự lớn hơn hoặc bằng 6 kí tự" });
            // }
            // var arrz = password.match(/([0-9]|[a-z]|[A-Z])/g);
            // if (arrz.length != password.length) {
            //     await clientRedis.del(keyrutVang)
            //     return res.json({ error: 1, message: "<strong>Thất bại!</strong> Mật khẩu phải là 1 chuỗi kí tự từ a -> z, A -> Z hoặc 0 -> 9" });
            // }

            // const vaildPass = await bcrypt.compare(password, user.password)
            // if (!vaildPass) {
            //     await clientRedis.del(keyrutVang)
            //     return res.json({ error: 1, message: '<strong>Thất bại! </strong>Mật khẩu không chính xác' })
            // }

            const countrutvang = await Rutvang.countDocuments({ status: 0, tnv: name.toLowerCase() })

            if (countrutvang && countrutvang > 0) {
                await clientRedis.del(keyrutVang)
                return res.json({ error: 1, message: "<strong>Thất bại: </strong> Vui lòng hủy đơn trước đó !!!" });
            }


            var solancuoc = 0;
            const cuocs = await Cuoc.countDocuments({ uid: user._id, status: { $ne: 5 } })
            const cuockenos = await Cuockeno.countDocuments({ uid: user._id, status: { $ne: 5 } })
            const cuoctxs = await Cuoctx.countDocuments({ uid: user._id.toString() })
            const cuocchanle = await CuocChanle.countDocuments({ uid: user._id.toString() })
            solancuoc = cuocs + cuockenos + cuoctxs + cuocchanle
            if (solancuoc < 5) {
                await clientRedis.del(keyrutVang)
                return res.json({ error: 1, message: "<strong>Thất bại: </strong> Đặt cược trên 5 ván mới có thể rút !!!" });
            }

            var sucvat = "server" + req.user.server
            var ishanmuc = setting.hanmuc[sucvat]

            if (user) {

                if (user.vang < gold2) {
                    await clientRedis.del(keyrutVang)
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Bạn không đủ vàng để rút" });
                }
                else if (user.hanmuc < gold2 && ishanmuc) {
                    await clientRedis.del(keyrutVang)
                    return res.json({ error: 1, message: "<strong>Thất bại: </strong> Hạn mức của bạn không đủ để rút" });
                }
                else {
                    if (ishanmuc) {
                        const uphanmuc = await Usercontrol.upHanmuc(user._id, -gold2 / 2, user.server)
                    }

                    const upgold = await Usercontrol.upMoney(user._id, -gold2)
                    const soduu = await Usercontrol.sodu(user._id, "-" + numberWithCommas(gold2), "Rút vàng")
                    if (upgold.username === user.username && (user.vang - upgold.vang == gold2)) {



                        const newRutvang = new Rutvang({ uid: req.user._id, server: req.user.server, sovang: gold2, tnv: name.toLowerCase(), taikhoan: req.user.name, cuocngay: user.thanhtichngay })
                        try {
                            const rutvang = await newRutvang.save();
                            var table = "<tr><td hidden=''>" + rutvang._id + "</td>" + '<td>' + rutvang.server + '</td>' + '<td>' + rutvang.tnv + '</td>' + '<td>' + numberWithCommas(rutvang.sovang) + '</td>' + '<td>' + getStatus(rutvang.status) + '</td>' + '<td>' + new Date(Date.parse(rutvang.time)).toLocaleString() + '</td>' + '</tr>';
                            setTimeout(async () => {
                                const checkcc = await Rutvang.findOne({ _id: rutvang._id, status: 0 })
                                if (checkcc) {
                                    const rut = await Rutvang.findOneAndUpdate({ _id: rutvang._id, status: 0 }, { status: 2 })
                                    if (rut) {
                                        const user = await User.findOneAndUpdate({ _id: rutvang.uid }, { $inc: { vang: rutvang.sovang } })
                                        const sodu = await Usercontrol.sodu(rutvang.uid, "+" + numberWithCommas(rut.sovang), "Hoàn đơn rút vàng")
                                        const zzzz = await Usercontrol.upHanmuc(rutvang.uid, rut.sovang / 2, rutvang.server)
                                    }
                                }
                            }, 900000);
                            await clientRedis.del(keyrutVang)
                            return res.json({ error: 0, message: "<strong>Thành công</strong> Bạn vui lòng tới địa điểm giao hàng gặp BOT để giao dịch", table: table });
                        }
                        catch {
                            await clientRedis.del(keyrutVang)
                            return res.json({ error: 1, message: "<strong>Thất bại: </strong> Có Lỗi vui lòng thử lại sau" });
                        }
                    }
                }
            }
        }
    }
    res.send("null")
})
module.exports = router