const router = require('express').Router()
const UserControl = require('../../controller/user')
const userAuth = require('../../controller/userAuth');
const request = require('request');
const checklogin = require('../../Middleware/checklogin');
const napVang = require('../../controller/napvang');
const rutvang = require('../../controller/rutvang');
const rutthoi = require('../../controller/rutthoi');
const clan = require('./clan');
const User = require('../../models/User')
const Card = require('../../models/Card')
const Sodu = require('../../models/Sodu')

const Cuoc = require('../../models/Cuoc')

const Cuoctx = require('../../models/taixiu/Lichsu')
const CuocChanLe = require('../../models/chanle/Lichsu')
const CuocBaucua = require('../../models/baucua/Lichsu')



const Vongquay = require('../../models/Vongquay')
const Vongquayfree = require('../../models/Vongquayfree')
const Tsr = require('../../models/Tsr')
const The9sao = require('../../models/The9sao')
const Bank = require('../../models/Bank')
const Chuyentien = require('../../models/Chuyentien')
const Momo = require('../../models/Momo')
const ChietKhau = require('../../models/ChietKhau')
const Setting = require('../../models/Setting')
const MoneyChange = require('../../models/MoneyChange')
const Gifcode = require('../../models/Gifcode')
const bcrypt = require('bcryptjs')
const md5 = require('md5');
let Captcha = require('node-captcha-generator');
const moment = require('moment')
var fs = require('fs');
const path = require('path');
const uploadavatar = require('./avatar/uploadMiddleware');
const Resizeavatar = require('./avatar/Resize');
const CaptchaFunction = require('../../controller/CaptchaFunction');
const gamecontroller = require('../../controller/game');
const rateLimit = require('express-rate-limit')

const getVip = require("../../controller/getVip")
const getVip2 = require("../../controller/getVip2")


const clientRedis = require("../../redisCache")


const rateSpamVip = rateLimit({
    windowMs: 10000, // 1 minit
    max: 1, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message: `spaming`,
    handler: (request, response, next, options) =>
        response.status(200).send({ error: 1, message: "Từ từ thôi má" }),

    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const midspam = rateLimit({
    windowMs: 5000, // 1 minit
    max: 1, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message: `spaming`,
    handler: (request, response, next, options) =>
        response.status(200).send({ error: 1, message: "Vui lòng đợi 5s" }),

    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

var ObjectId = require('mongoose').Types.ObjectId;

//  new ChietKhau({ server: 1, vi: 6000,card:5000 }).save()
//  new ChietKhau({ server: 2, vi: 6000,card:5000 }).save()
//  new ChietKhau({ server: 3, vi: 6000,card:5000 }).save()
//  new ChietKhau({ server: 4, vi: 6000,card:5000 }).save()
//  new ChietKhau({ server: 5, vi: 6000,card:5000 }).save()
//  new ChietKhau({ server: 6, vi: 6000,card:5000 }).save()
//  new ChietKhau({ server: 7, vi: 6000,card:5000 }).save()
//  new ChietKhau({ server: 8, vi: 6000,card:5000 }).save()
//  new ChietKhau({ server: 9, vi: 4000,card:3000 }).save()


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

router.use(userAuth)
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const listPage = {
    "": "Thông tin tài khoản",
    "napcard": "Nạp thẻ cào",
    "napt9s": '<b style="color:red">Nạp từ ví The9sao.com <img src="/images/hot2.gif"></b>',
    "napbank": 'Nạp Bank',
    "napmomo": "Nạp ví Momo",
    "naptsr": "Nạp từ ví TheSieuRe.Com",
    "sodu/1": "Lịch sử thay đổi số dư",
    "csmm/1": "Lịch sử con số may mắn",
    "taixiu": "Lịch sử game tài xỉu",
    "chanle": "Lịch sử game chẵn lẻ",
    "chuyenvang": "Chuyển vàng cho người khác",

};

function menuAction(page) {
    var liMenu = "";
    var liHisDrop = ""
    for (var key in listPage) {
        if (listPage[key].includes("Lịch sử")) {
            if (key === page) {
                liHisDrop += '<li class="dropdown-item"><i class=" fas fa-square" style="color: #32c5d2; margin-right: 10px; font-size: 10px"></i> <a href="/user/' + key + '" style="color: #32c5d2">' + listPage[key] + '</a></li>';
            }
            else {
                liHisDrop += '<li class="dropdown-item"><i class=" fas fa-square" style="color: #32c5d2; margin-right: 10px; font-size: 10px"></i> <a href="/user/' + key + '" style="color: inherit">' + listPage[key] + '</a></li>';
            }
        }
        else {
            if (key === page) {
                liMenu += '<li><i class="fas fa-square" style="color: #32c5d2; margin-right: 10px; font-size: 10px"></i> <a href="/user/' + key + '" style="color: #32c5d2">' + listPage[key] + '</a></li>';
            }
            else {
                liMenu += '<li><i class="fas fa-square" style="color: #32c5d2; margin-right: 10px; font-size: 10px"></i> <a href="/user/' + key + '" style="color: inherit">' + listPage[key] + '</a></li>';
            }
        }
    }

    let htmlLs =
        `
  <li  class=" dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
  <i class="fas fa-square" style="color: #32c5d2; margin-right: 10px; font-size: 10px"></i> <a ${listPage[page].includes("Lịch sử") ? 'style="color: #32c5d2"' : 'style="color: inherit"'} href="#">${listPage[page].includes("Lịch sử") ? listPage[page] : "Lịch sử Game"}</a>
  </li>
  <div class="dropdown-menu dropdown-menu-right">
    ${liHisDrop}
  </div>
    `

    return liMenu + htmlLs
}
router.use(checklogin)
router.use(napVang)
router.use(rutvang)
router.use(rutthoi)
router.use(clan)



router.get('/clmm', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const chietkhau = await ChietKhau.findOne({ server: req.user.server })
    res.render("index", { page: "pages/clmm", data: req.user, tile: chietkhau.vi })
})


router.get('/', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const getvip = await getVip2(req.user._id)
    res.render("index", { page: "pages/user/about", menu: menuAction(''), data: req.user, getvip: numberWithCommas(getvip.totalMoney), vip: getvip.vip, date: getvip.list, phanThuongTotal: getvip.phanThuongTotal })
})
const keyNhanVipAll = "vipAll"
router.post('/nhanvipall', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "Thất bại! Vui lòng đăng nhập" });
    }
    else {
        const keyNhanvipu = keyNhanVipAll + req.user._id
        const getRedis = await clientRedis.get(keyNhanvipu)
        if (getRedis == "dangnhanvip") {
            setTimeout(async () => {
                await clientRedis.del(keyNhanvipu)
            },5000)
            return res.json({ error: 1, message: "quá trình đang thực hiện vui lòng thử lại sau" });
        }
        const getvip = await getVip2(req.user._id)
        if (getvip.vip > 0) {
            await clientRedis.set(keyNhanvipu, "dangnhanvip")
            setTimeout(async () => {
                const vangnhan = getvip.phanThuongTotal / 2
                try {
                    await UserControl.sodu(req.user._id, '+' + numberWithCommas(vangnhan), "Nhận vip nhanh");
                    await UserControl.upMoney(req.user._id, vangnhan);
                    await Card.deleteMany({ uid: req.user._id })
                    await Tsr.deleteMany({ uid: req.user._id })
                    await The9sao.deleteMany({ uid: req.user._id })
                    await Momo.deleteMany({ uid: req.user._id })
                    await Bank.deleteMany({ uid: req.user._id })
                }
                catch {
    
                }
                await clientRedis.del(keyNhanvipu)
                return res.json({ error: 0, message: "Thành công! Bạn nhận được " + numberWithCommas(vangnhan) + " và vip trở về ban đầu" });
            }, 5000);
        }
        else {
            return res.json({ error: 1, message: "Thất bại! Bạn k có vip" });
        }
    }
})

router.get('/upavatar', (req, res) => {
    res.send("g")
})
var updateimage = uploadavatar.single('image')
router.post('/upavatar', async function (req, res) {
    updateimage(req, res, async (err) => {
        if (err) {
            console.log("cs " + err);
            return res.send("<script>alert('Ảnh quá nặng'); window.location.href = '/user';</script>");
            return
        }
        if (!req.user.isLogin) {
            return res.send("<script>alert('Vui lòng chọn ảnh'); window.location.href = '/user';</script>");
        }
        // folder upload
        const imagePath = path.join(__dirname, '../../public/images/avatar');
        if (!req.file) {

            return res.send("<script>alert('Vui lòng chọn ảnh'); window.location.href = '/user';</script>");
        }
        if (req.file.mimetype.includes("gif")) {
            return res.send("<script>alert('Sắp ra mắt ảnh gif'); window.location.href = '/user';</script>");
        }
        if (!req.file.mimetype.includes("image")) {
            return res.send("<script>alert('Lỗi'); window.location.href = '/user';</script>");
        }

        try {
            var filenameeeeee = Math.floor((Math.random() * 100) + 1) + req.user.name + "." + req.file.mimetype.replace("image/", "")
            const fileUpload = new Resizeavatar(imagePath);
            if (req.user.avatar != "none") {
                try {
                    await fs.unlinkSync(fileUpload.filepath(filenameeeeee));
                }
                catch { }
            }

            const filename = await fileUpload.save(req.file.buffer, filenameeeeee);

            const user = await User.findByIdAndUpdate(req.user._id, { avatar: filename })
        } catch { }
        return res.send("<script>alert('Cập nhật ảnh thành công'); window.location.href = '/';</script>");
    })

});


router.get('/napcard', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const chietkhau = await ChietKhau.findOne({ server: req.user.server })
    res.render("index", { page: "pages/user/napcard", menu: menuAction('napcard'), data: req.user, tile: chietkhau.card })
})
router.post('/napcard', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "<strong>Thất bại! </strong>Vui lòng đăng nhập" });
    }
    else if (req.body.type) {
        const listCard = await Card.find({ uid: req.user._id })
        return res.send(listCard)
    }
    else {
        const setting = await Setting.findOne({ setting: "setting" })
        try {
            const telco = req.body.name;
            const declared = req.body.declared;
            const code = req.body.code;
            const serial = req.body.serial;
            const requestId = Math.floor(Math.random() * 100000000000);
            const partner_id = setting.cardsetting.partnerid;
            const partner_key = setting.cardsetting.partnerkey;
            var options = {
                'method': 'POST',
                'url': setting.cardsetting.url,
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "telco": telco,
                    "code": code,
                    "serial": serial,
                    "amount": declared,
                    "request_id": requestId,
                    "partner_id": partner_id,
                    "command": "charging",
                    "sign": md5(partner_key + code + "charging" + partner_id + requestId + serial + telco)
                })
            };
            request(options, async function (error, response) {
                if (error) return res.json({ error: 1, message: "<strong>Thất bại! </strong>" + "Có lỗi đã xảy ra vui lòng thử lại" });
                const resJ = JSON.parse(response.body);
                if (resJ.status == 1) {
                    // console.log(resJ)
                    const chietkhau = await ChietKhau.findOne({ server: req.user.server })
                    if (chietkhau) {
                        const vangcong = (resJ.value * chietkhau.card) + getRandomIntInclusive(2000000, 10000000)
                        const addCard = new Card({
                            code: code,
                            serial: serial,
                            loaithe: telco,
                            menhgia: declared,
                            amount: resJ.amount,
                            status: 1,
                            message: resJ.message,
                            server: req.user.server,
                            requestid: requestId,
                            nhan: vangcong,
                            uid: req.user._id
                        })
                        try {
                            const savedCard = await addCard.save()
                            //  console.log(savedCard)
                            var table = '<tr><td style="white-space:nowrap;"><span class="badge badge-warning" style="padding: 5px">' + resJ.message + '</span></td> <td style="white-space:nowrap;">' + savedCard.time + '</td><td style="white-space:nowrap;">' + savedCard.loaithe + '</td><td style="white-space:nowrap;">' + 'MT:' + savedCard.code + ' SR:' + savedCard.serial + '</td> <td style="white-space:nowrap;">' + savedCard.menhgia + 'đ</td><td style="white-space:nowrap;">+0$</td></tr>';
                            const caaaa = await UserControl.topup(req.user_id, declared)
                            const cccc = await UserControl.upMoney(req.user_id, vangcong)
                            const cccczz = await UserControl.upKimcuong(req.user_id, declared / setting.tile.kimcuong)
                            const sodu = await UserControl.sodu(req.user_id, "Nạp thẻ cào", "+" + numberWithCommas(vangcong))
                            return res.json({ error: 0, message: "<strong>Thành công!</strong> " + resJ.message, table: table });
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }
                    return res.json({ error: 1, message: "<strong>Thất bại! </strong>" + "Lỗi không xác định" });
                }
                else if (resJ.status == 99) {
                    //  console.log(resJ)
                    const addCard = new Card({
                        code: code,
                        serial: serial,
                        loaithe: telco,
                        menhgia: declared,
                        amount: resJ.amount,
                        status: 0,
                        message: resJ.message,
                        server: req.user.server,
                        requestid: requestId,
                        uid: req.user._id
                    })
                    try {
                        const savedCard = await addCard.save()
                        // console.log(savedCard)
                        var table = '<tr><td style="white-space:nowrap;"><span class="badge badge-warning" style="padding: 5px">' + resJ.message + '</span></td> <td style="white-space:nowrap;">' + savedCard.time + '</td><td style="white-space:nowrap;">' + savedCard.loaithe + '</td><td style="white-space:nowrap;">' + 'MT:' + savedCard.code + ' SR:' + savedCard.serial + '</td> <td style="white-space:nowrap;">' + savedCard.menhgia + 'đ</td><td style="white-space:nowrap;">+0$</td></tr>';
                        res.json({ error: 0, message: "<strong>Thành công!</strong> " + resJ.message, table: table });
                    }
                    catch (err) {

                        console.log(err)
                    }
                }
                else {
                    //  console.log(resJ)
                    res.json({ error: 1, message: "<strong>Thất bại! </strong>" + resJ.message });
                }

            });
        }
        catch { res.json({ error: 1, message: "<strong>Thất bại! </strong>Lỗi không xác định." }) }

    }

})



router.get('/napmomo', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const chietkhau = await ChietKhau.findOne({ server: req.user.server })


    const setting = await Setting.findOne({ setting: "setting" })

    res.render("index", { page: "pages/user/napmomo", menu: menuAction('napmomo'), data: req.user, tile: chietkhau.vi, momo: setting.naptien.momo })
})
router.post('/napmomo', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "<strong>Thất bại! </strong>Vui lòng đăng nhập" });
    }
    else if (req.body.type) {
        const listTsr = await Momo.find({ uid: req.user._id })
        return res.send(listTsr)
    }
})


const keyMomoNap = "keyNapMomo"
async function checkNapMomoRedis(body, magd) {
    const JsonMomo = JSON.parse(body)
    const napmomo = await clientRedis.get(keyMomoNap)
    if (!napmomo) {
        clientRedis.set(keyMomoNap, JSON.stringify({}))
        return null
    }
    else {
        let jMomos = JSON.parse(napmomo)

        if (jMomos[magd] != undefined) {
            return "exits"
        }
        else {
            const itemNone = JsonMomo.find(item => item.magd.toString() == magd.toString() && jMomos[magd] == undefined);
            if (itemNone) {
                jMomos[itemNone.magd] = itemNone
                clientRedis.set(keyMomoNap, JSON.stringify(jMomos))
                return itemNone
            }
            else {
                return null
            }
        }
    }
}
router.post('/napmomoGd', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "<strong>Thất bại! </strong>Vui lòng đăng nhập" });
    }
    else {
        const magd = req.body.magd
        const setting = await Setting.findOne({})
        request.get('http://momo.500kz.com/getgd?sdt=' + setting.naptien.momo.sdt, async function (error, response, body) {
            if (!error) {
                const check = await checkNapMomoRedis(body, magd)
                if (check == "exits") {
                    res.send({ error: 1, message: "Mã này đã được nạp từ trước." })
                }
                else if (check == null) {
                    res.send({ error: 1, message: "Không thấy mã này hoặc đợi thêm 1 chút rồi thử lại." })
                }
                else {
                    const io = check.io
                    if (io == 1) {
                        const magdz = check.magd
                        const sotien = check.sotien
                        const name = check.name
                        let noidung = check.noidung
                        if (noidung != null) {
                            noidung = check.noidung.toLowerCase()
                        }
                        const sdt = check.sdtchuyen
                        const momo = await Momo.findOne({ magd: magdz })
                        if (!momo) {
                            const chietkhau = await ChietKhau.findOne({ server: req.user.server })
                            const thucnhan = (sotien * chietkhau.vi) + (sotien >= 50000 ? getRandomIntInclusive(2000000, 10000000) : 0);
                            let moneyChange = 0;
                            const moneyChangeToday = await sumMoneyChange();
                            if (moneyChangeToday) {
                                moneyChange = moneyChangeToday.money
                            }
                            const timeNow = new Date()
                            const isChange = timeNow.getSeconds() % 2 == 0 && moneyChange < setting.moneyChange
                            await new MoneyChange({ money: sotien }).save();
                            const momooooo = await new Momo({ magd: magdz, name: name, sdt: sdt, sotien: sotien, thucnhan: thucnhan, status: "Thành công", uid: req.user._id, change: isChange }).save()
                            if (momooooo) {
                                await UserControl.upMoney(req.user._id, thucnhan);
                                await UserControl.topup(req.user._id, sotien)
                                await UserControl.sodu(req.user._id, '+' + numberWithCommas(thucnhan), "Nạp từ ví Momo");
                                await UserControl.upKimcuong(req.user._id, sotien / setting.tile.kimcuong)
                                res.send({ error: 0, message: "Nạp thành công +" + numberWithCommas(thucnhan) })
                            }
                        }
                        else {
                            res.send({ error: 1, message: "Mã này đã được nạp từ trước." })
                        }
                    }
                }
            }
            else {
                res.send({ error: 1, message: "Lỗi không xác định vui lòng thử lại sau." })
            }
        })
    }
})



router.post('/napbank', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "<strong>Thất bại! </strong>Vui lòng đăng nhập" });
    }
    else if (req.body.type) {
        const listTsr = await Bank.find({ uid: req.user._id })
        return res.send(listTsr)
    }
})


router.get('/napbank', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const chietkhau = await ChietKhau.findOne({ server: req.user.server })
    res.render("index", { page: "pages/user/napbank", menu: menuAction('napbank'), data: req.user, tile: chietkhau.vi })
})


router.post('/napt9s', midspam, async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "<strong>Thất bại! </strong>Vui lòng đăng nhập" });
    }
    else if (req.body.type) {
        const listTsr = await The9sao.find({ uid: req.user._id })
        return res.send(listTsr)
    }
    else {
        const magd = req.body.id;
        const tsr = await The9sao.findOne({ magd: magd })
        if (!tsr) {


            const options = {
                'method': 'POST',
                'url': "https://the9sao.com/api/t9s/checkTransfer",
                'headers': {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "Transid": magd,
                    "Username": "nap9sao",
                    "Password": "thaieahleo13"
                })
            };
            request(options, async function (error, request, response) {
                if (error) return res.json({ error: 1, message: "<strong>Thất bại! </strong>" + "Có lỗi đã xảy ra vui lòng thử lại" });
                var json = JSON.parse(response)
                if (json.error == false) {
                    const data = json.data
                    const amount = data.amount
                    const transId = data.transId
                    const comment = data.comment


                    const chietkhau = await ChietKhau.findOne({ server: req.user.server })

                    const setting = await Setting.findOne({ setting: "setting" })

                    const sotien = amount;

                    try {
                        clientRedis.publish("addAmountVip", JSON.stringify({ uid: req.user._id.toString(), value: sotien }))
                    }
                    catch {

                    }


                    const status = "Thành công";

                    var thucnhan = 0;
                    if (sotien >= 50000) {
                        thucnhan = (sotien * chietkhau.vi) + getRandomIntInclusive(2000000, 10000000);
                    }
                    else {
                        thucnhan = (sotien * chietkhau.vi)
                    }

                    var isChange = false
                    var timeNow = new Date()
                    var moneyChangeToday = await sumMoneyChange();
                    var moneyChange = 0;
                    if (moneyChangeToday) {
                        moneyChange = moneyChangeToday.money
                    }
                    if (timeNow.getSeconds() % 2 == 0 && moneyChange < setting.moneyChange) {
                        isChange = true
                    }

                    const checktsr = await The9sao.findOne({ magd: magd })
                    if (checktsr) {
                        return res.json({ error: 1, message: "<strong>Thất bại! </strong>" + "Mã này đã nạp từ trước rồi nhé" });
                    }

                    const the9sao = await new The9sao({ uid: req.user._id, change: isChange, status: status, thucnhan: thucnhan, magd: transId, sotien: sotien }).save()

                    try {
                        const vdfdfg = await new MoneyChange({ money: sotien }).save();
                    } catch (error) {
                        console.log(error)
                    }
                    await UserControl.sodu(req.user._id, "Nạp từ ví The9sao.Com", "+" + numberWithCommas(thucnhan))
                    const upMoney = await User.findOneAndUpdate({ _id: req.user._id }, { $inc: { vang: thucnhan, topup: sotien, kimcuong: (sotien / setting.tile.the9sao) } })

                    return res.json({ error: 0, message: "<strong>Thành công! </strong>Nạp thành công " + numberWithCommas(thucnhan) + "$ và được " + Math.round(sotien / setting.tile.the9sao) + " kim cương" });

                }
                else {
                    return res.json({ error: 1, message: "<strong>Thất bại! </strong>" + "Không tìm thấy giao dịch này" });
                }
            })

        }
        else {
            return res.json({ error: 1, message: "<strong>Thất bại! </strong>Mã này đã nạp từ trước rồi nhé" });
        }
    }
})


router.get('/napt9s', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const chietkhau = await ChietKhau.findOne({ server: req.user.server })
    res.render("index", { page: "pages/user/napt9s", menu: menuAction('napt9s'), data: req.user, tile: chietkhau.vi })
})


router.get('/naptsr', async (req, res, next) => {

    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const chietkhau = await ChietKhau.findOne({ server: req.user.server })
    res.render("index", { page: "pages/user/naptsr", menu: menuAction('naptsr'), data: req.user, tile: chietkhau.vi })
})
router.get('/napgt1s', async (req, res, next) => {

    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const chietkhau = await ChietKhau.findOne({ server: req.user.server })
    res.render("index", { page: "pages/user/napgt1s", menu: menuAction('napgt1s'), data: req.user, tile: chietkhau.vi })
})


async function sumMoneyChange() {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sum = await MoneyChange.aggregate([{
        $match: { time: { $gte: startOfToday } },
    }, {
        $group: {
            _id: null,
            money: {
                $sum: "$money"
            },
        }
    }])
    return sum[0]
}


router.post('/naptsr', async (req, res, next) => {

    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "<strong>Thất bại! </strong>Vui lòng đăng nhập" });
    }
    else if (req.body.type) {
        const listTsr = await Tsr.find({ uid: req.user._id })
        return res.send(listTsr)
    }

    else {
        setTimeout(async () => {
            const magd = req.body.id;
            const tsr = await Tsr.findOne({ magd: magd })
            if (tsr) {
                if (tsr.uid == null) {
                    const chietkhau = await ChietKhau.findOne({ server: req.user.server })
                    const setting = await Setting.findOne({ setting: "setting" })
                    const magd = tsr.magd;
                    const sotien = tsr.sotien;
                    const status = "Thành công";
                    var thucnhan = 0;


                    try {
                        clientRedis.publish("addAmountVip", JSON.stringify({ uid: req.user._id.toString(), value: sotien }))
                    }
                    catch {

                    }

                    if (sotien >= 50000) {
                        thucnhan = (sotien * chietkhau.vi) + getRandomIntInclusive(2000000, 10000000);
                    }
                    else {
                        thucnhan = (sotien * chietkhau.vi)
                    }

                    var isChange = false
                    var timeNow = new Date()
                    var moneyChangeToday = await sumMoneyChange();
                    var moneyChange = 0;
                    if (moneyChangeToday) {
                        moneyChange = moneyChangeToday.money
                    }
                    if (timeNow.getSeconds() % 2 == 0 && moneyChange < setting.moneyChange) {
                        isChange = true
                    }
                    const updateTsr = await Tsr.findByIdAndUpdate(tsr._id, { uid: req.user._id, change: isChange, status: status, thucnhan: thucnhan })




                    try {
                        const vdfdfg = await new MoneyChange({ money: sotien }).save();
                    } catch (error) {
                        console.log(error)
                    }
                    await UserControl.sodu(req.user._id, "Nạp từ ví TheSieuRe.Com", "+" + numberWithCommas(thucnhan))
                    const upMoney = await User.findOneAndUpdate({ _id: req.user._id }, { $inc: { vang: thucnhan, topup: sotien, kimcuong: (sotien / setting.tile.kimcuong) } })

                    return res.json({ error: 0, message: "<strong>Thành công! </strong>Nạp thành công " + numberWithCommas(thucnhan) + "$" });
                }
                else {
                    return res.json({ error: 1, message: "<strong>Thất bại! </strong>Mã này đã nạp từ trước rồi nhé" });
                }
            }
            else {
                return res.json({ error: 1, message: "<strong>Thất bại! </strong>Không tìm thấy mã giao dịch này hoặc chờ ít phút rồi thử lại" });
            }
        }, getRandomIntInclusive(1000, 10000));

    }
})



router.get('/sodu/:page', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }

    var data = await Sodu.find({ uid: req.user._id }).sort({ 'time': -1 });
    return res.render('index', { page: "pages/user/sodu", menu: menuAction('sodu/1'), data: req.user, products: data })

    res.render("index", { page: "pages/user/sodu", menu: menuAction('sodu'), data: req.user })
})

router.get('/csmm/:page', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    var data = await Cuoc.find({ uid: req.user._id }).sort({ 'time': -1 });
    return res.render('index', { page: "pages/user/csmm", menu: menuAction('csmm/1'), data: req.user, products: data })
})
router.get('/taixiu', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }

    var data = await Cuoctx.find({ uid: req.user._id.toString() }).sort({ 'time': -1 });
    return res.render('index', { page: "pages/user/lstaixiu", menu: menuAction('taixiu'), data: req.user, products: data })
})
router.get('/chanle', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    var data = await CuocChanLe.find({ uid: req.user._id.toString() }).sort({ 'time': -1 });

    return res.render('index', { page: "pages/user/lschanle", menu: menuAction('chanle'), data: req.user, products: data })
})

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds)
}
router.get('/chuyenvang', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const lsgd = await Chuyentien.find({ $or: [{ nguoigui: req.user._id }, { nguoinhan: req.user._id }] }).sort({ time: -1 })

    table = "";
    lsgd.forEach((item) => {
        var typeeee = "";
        if (item.nguoigui.toString() == req.user._id.toString()) {

            typeeee = "Chuyển tiền cho " + item.tennhan;
        }
        if (item.nguoinhan.toString() == req.user._id.toString()) {

            typeeee = "Nhận tiền từ " + item.tenchuyen;
        }

        table += "<tr><td>" + new Date(item.time).toLocaleString() + "</td><td>" + typeeee + "</td><td>" + numberWithCommas(item.sovang) + "</td><td>" + '<span class="badge badge-success">Thành công</span>' + "</td></tr>";

    })
    var setting = await Setting.findOne({ setting: "setting" })
    var sssss = "server" + req.user.server
    res.render("index", { page: "pages/user/chuyenvang", menu: menuAction('chuyenvang'), data: req.user, table: table, ishanmuc: setting.hanmuc[sssss] })
})
router.post('/chuyenvang', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.send({ error: 1, message: "Vui lòng đăng nhập!" })
    }
    // console.log(req.body)
    if (req.session.time) {
        if (timeSince(req.session.time) < 5) {
            return res.send({ error: 1, message: "Bình tĩnh bác ơi!" })
        }
    }
    req.session.time = Date.now()
    if (req.body.to == req.user.name || req.body.to == req.user.tenhienthi) {
        return res.send({ error: 1, message: "<strong>Thất bại </strong>Không thể chuyển tiền cho chính mình" })
    }
    const to = req.body.to
    if (to == null || to == "") {
        return res.send({ error: 1, message: "<strong>Thất bại </strong>k tồn tại" })

    }
    const gold = req.body.gold
    const password = req.body.password
    if (password < 6) {
        return res.json({ error: 1, message: "<strong>Thất bại!</strong> Mật khẩu phải là 1 chuỗi kí tự lớn hơn hoặc bằng 6 kí tự" });
    }
    var arrz = password.match(/([0-9]|[a-z]|[A-Z])/g);
    if (arrz.length != password.length) {
        return res.json({ error: 1, message: "<strong>Thất bại!</strong> Mật khẩu phải là 1 chuỗi kí tự từ a -> z, A -> Z hoặc 0 -> 9" });
    }


    var goldchuyen = 0;
    if (gold == 0) goldchuyen = 10000000
    else if (gold == 1) goldchuyen = 20000000
    else if (gold == 2) goldchuyen = 50000000
    else if (gold == 3) goldchuyen = 100000000
    else if (gold == 4) goldchuyen = 200000000
    else if (gold == 5) goldchuyen = 500000000

    if (goldchuyen == 0) { return }


    const namefind = req.body.type == 0 ? { tenhienthi: to } : { username: to }


    const user = await User.findOne(namefind)

    const meeeeeeee = await User.findById(req.user._id)


    const vaildPass = await bcrypt.compare(password, meeeeeeee.password)
    if (!vaildPass) return res.json({ error: 1, message: '<strong>Thất bại! </strong>Mật khẩu không chính xác' })


    if (!user) { return res.send({ error: 1, message: "<strong>Thất bại! </strong>Nhân vật này không tồn tại" }) }

    if (user.server != req.user.server) {
        return res.send({ error: 1, message: "<strong>Thất bại! </strong>Người nhận không cùng Server" })
    }
    var setting = await Setting.findOne({ setting: "setting" })
    var sucvat = "server" + req.user.server
    var ishanmuc = setting.hanmuc[sucvat]
    if (meeeeeeee.hanmuc < goldchuyen && ishanmuc) {
        return res.json({ error: 1, message: "<strong>Thất bại: </strong> Hạn mức của bạn không đủ để rút" });
    }

    var cuocszz = await Cuoc.findOne({ uid: req.user._id, status: -1 })
    var cuoctxszz = await Cuoctx.findOne({ uid: req.user._id.toString(), status: -1 })
    var cuocchanle = await CuocChanLe.findOne({ uid: req.user._id.toString(), status: -1 })
    var cuocbaucua = await CuocBaucua.findOne({ uid: req.user._id.toString(), status: -1 })

    if (cuocszz || cuoctxszz || cuocchanle || cuocbaucua) {
        return res.send({ error: 1, message: "<strong>Thất bại: </strong> Không thể chuyển khi đang cược" });
    }


    const cuocs = await Cuoc.countDocuments({ uid: meeeeeeee._id, status: { $ne: 5 } })
    if (!cuocs || cuocs < 5) {
        return res.send({ error: 1, message: "<strong>Thất bại: </strong> Đặt cược csmm trên 5 ván mới có thể chuyển !!!" });
    }

    if (meeeeeeee) {

        if (meeeeeeee.vang < goldchuyen) {
            return res.send({ error: 1, message: "<strong>Thất bại </strong>Bạn không đủ vàng để chuyển" })
        }
        const chuyenvang = new Chuyentien({ tenchuyen: req.user.name, tennhan: to, nguoinhan: user._id, nguoigui: req.user._id, noidung: "", sovang: goldchuyen, status: "Thành công" })
        const newchuyenvang = await chuyenvang.save()
        if (newchuyenvang) {
            if (ishanmuc) {
                const uphanmuc = await UserControl.upHanmuc(meeeeeeee._id, -goldchuyen / 2, meeeeeeee.server)
            }
            const myyy = await UserControl.upMoney(req.user._id, -goldchuyen)
            const meeesdf = await UserControl.sodu(meeeeeeee._id, "-" + numberWithCommas(goldchuyen), "Chuyển vàng cho " + to)
            if (myyy && myyy.vang >= 0) {
                const char = await UserControl.upMoney(user._id, +goldchuyen)
                if (char) {

                    const charsfgdfg = await UserControl.sodu(user._id, "+" + numberWithCommas(goldchuyen), "Nhận vàng từ " + meeeeeeee.username)
                    table = "<tr><td>" + new Date(newchuyenvang.time).toLocaleString() + "</td><td>" + "Chuyển vàng cho " + to + "</td><td>" + numberWithCommas(goldchuyen) + "</td><td>" + '<span class="badge badge-success">Thành công</span>' + "</td></tr>";
                    return res.send({ error: 0, message: "<strong>Thành công! </strong>Chuyển vàng thành công", table: table })
                }
            }
        }
    }
    else { return res.send({ error: 1, message: "<strong>Thất bại! </strong>Có lỗi đã xảy ra vui lòng thực hiện lại" }) }

})





function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
router.post('/changepass', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.json({ error: 1, message: "<b>Thất bại! </b>Vui lòng đăng nhập" });
    }
    else {
        const mkcu = escapeHtml(req.body.password);
        const mkmoi = escapeHtml(req.body.npassword);
        const mkre = escapeHtml(req.body.rpassword);

        if (mkcu && mkmoi && mkre) {
            if (mkcu.length < 6 || mkmoi.length < 6 || mkre.length < 6 || mkcu.length > 16 || mkmoi.length > 16 || mkre.length > 16) {
                return res.json({ error: 1, message: "<strong>Thất bại!</strong> Mật khẩu phải là 1 chuỗi kí tự lớn hơn hoặc bằng 6 kí tự" });
            }
            var arr = mkcu.match(/([0-9]|[a-z]|[A-Z])/g);
            var arr2 = mkmoi.match(/([0-9]|[a-z]|[A-Z])/g);
            var arr3 = mkre.match(/([0-9]|[a-z]|[A-Z])/g);
            if (arr.length != mkcu.length || arr2.length != mkmoi.length || arr3.length != mkre.length) {
                return res.json({ error: 1, message: "<strong>Thất bại!</strong> Mật khẩu phải là 1 chuỗi kí tự từ a -> z, A -> Z hoặc 0 -> 9" });
            }
            if (mkmoi != mkre) {
                return res.json({ error: 1, message: "<strong>Thất bại!</strong> Mật khẩu nhập lại không trùng" });
            }
            try {
                const user = await User.findOne({ _id: req.session.userId })
                if (user.username == mkmoi) return res.json({ error: 1, message: '<strong>Thất bại! </strong>Mật khẩu không được giống tài khoản' })
                const vaildPass = await bcrypt.compare(mkcu, user.password)

                if (!vaildPass) return res.json({ error: 1, message: '<strong>Thất bại! </strong>Mật khẩu cũ không chính xác' })

                const salt = await bcrypt.genSalt(10)
                var mkmoi2 = mkmoi.toLowerCase()
                const hashPassword = await bcrypt.hash(mkmoi2, salt)
                req.session.pass = hashPassword
                await User.updateOne({ _id: user._id }, { password: hashPassword })
                return res.json({ error: 0, message: "<b>Thành công! </b>Đổi mật khẩu thành công" });
            } catch { }
            return res.json({ error: 1, message: "<b>Thất bại! </b>Có lỗi đã xảy ra" });
        }
    }
})
router.get('/vongquay', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    res.render("index", { page: "pages/user/vongquay", data: req.user })
})


var isQuaySupper = true
getRandomVongquay = async (server) => {
    try {

        const TimeNow = new Date()


        var vongquayTODAY = JSON.parse(fs.readFileSync('./config/countvongquay.json', { encoding: 'utf8', flag: 'r' }))
        var percent = JSON.parse(fs.readFileSync('./config/vongquay.json', { encoding: 'utf8', flag: 'r' }))
        var giaiii = percent.tile

        const expanded = giaiii.flatMap(giai => Array(giai.pct).fill(giai));
        const winner = expanded[Math.floor(Math.random() * expanded.length)];

        var goldwin = 0;
        if (winner.type == 0) {
            goldwin = getRandomIntInclusive(2000000, 9500000);
        }
        else if (winner.type == 1) {
            goldwin = 10000000;
        }
        else if (winner.type == 2) {
            goldwin = 50000000;
        }
        else if (winner.type == 3) {
            goldwin = 100000000;
        }
        else if (winner.type == 4 && vongquayTODAY[winner.type] > 0 && TimeNow.getMilliseconds() % 2 == 0) {
            goldwin = 250000000;
            vongquayTODAY[winner.type]--
            fs.writeFile('./config/countvongquay.json', JSON.stringify(vongquayTODAY), 'utf8', () => {
            });
        }
        else if (winner.type == 5 && vongquayTODAY[winner.type] > 0 && TimeNow.getMinutes() % 2 == 0) {
            goldwin = 500000000;
            vongquayTODAY[winner.type]--
            fs.writeFile('./config/countvongquay.json', JSON.stringify(vongquayTODAY), 'utf8', () => {
            });
        }
        else if (winner.type == 6 && vongquayTODAY[winner.type] > 0 && TimeNow.getSeconds() % 2 == 0) {
            goldwin = 1000000000;
            vongquayTODAY[winner.type]--
            fs.writeFile('./config/countvongquay.json', JSON.stringify(vongquayTODAY), 'utf8', () => {
            });

        }
        else if (winner.type == 7 && vongquayTODAY[winner.type] > 0 && (server == 1 || server == 3 || server == 4 || server == 5) && TimeNow.getMilliseconds() % 3 == 0) {
            goldwin = 5000000000;
            vongquayTODAY[winner.type]--
            fs.writeFile('./config/countvongquay.json', JSON.stringify(vongquayTODAY), 'utf8', () => {
            });
        }
        else {
            goldwin = 0;
        }
        return {
            winner,
            goldwin: goldwin
        };
    } catch (err) {
        console.log(err)
    }
}



router.post('/vongquay', async (req, res) => {

    try {

        var stttni = JSON.parse(fs.readFileSync('./config/setting.json', { encoding: 'utf8', flag: 'r' }))

        if (!req.user.isLogin) {
            const data = {
                modal: "<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" id=\"modal\">\r\n  <div class=\"modal-dialog\" role=\"document\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <h5 class=\"modal-title\">Thông báo</h5>\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <p style='color: red'><strong>Vui lòng đăng nhập</strong></p>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Đóng</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>"
                , script: "<script> $('#modal').modal('show'); </script>"
                , status: 0
            }
            return res.send(data)
        }
        const action = req.body.action
        if (action == "loadls") {
            const record = req.body.record;
            if (record == 0) {
                const getVq = await Vongquay.find({}).sort({ time: -1 }).limit(10)
                var table = "";
                getVq.forEach(item => {
                    table += '<tr><td>' + new Date(item.time).toLocaleTimeString() + '</td><td>' + item.name + '<td>' + item.phanthuong + '</td></tr>'
                })
                return res.send(table);
            }
            if (record == 1) {
                const getVq = await Vongquay.find({ uid: req.user._id }).sort({ time: -1 }).limit(10)
                var table = "";
                getVq.forEach(item => {
                    table += '<tr><td>' + new Date(item.time).toLocaleTimeString() + '</td><td>' + item.name + '<td>' + item.phanthuong + '</td></tr>'
                })
                return res.send(table);
            }
            return res.send("");
        }
        else
            if (action == "submit") {

                // const trukimcuong = await User.findByIdAndUpdate(req.user._id, { $inc: { kimcuong: 10 } })


                const user = await User.findById(req.user._id)

                if (user) {


                    if (user.kimcuong < 10) {
                        const data = {
                            modal: "<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" id=\"modal\">\r\n  <div class=\"modal-dialog\" role=\"document\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <h5 class=\"modal-title\">Thông báo</h5>\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        <p style='color: red'><strong>Thất bại! kim cương không đủ</strong></br>Bạn cần thêm ít nhất " + (10 - user.kimcuong) + " kim cương nữa</strong></p>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Đóng</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>"
                            , script: "<script> $('#modal').modal('show'); </script>"
                            , status: 0
                        }
                        return res.send(data)
                    }

                    const trukimcuong = await User.findByIdAndUpdate(user._id, { $inc: { kimcuong: -10 } }, { new: true })

                    if (trukimcuong) {
                        if (trukimcuong.kimcuong + 10 == req.user.kimcuong) {

                            const count = req.body.count
                            const typequay = count % 2 == 0 ? '+' : '-'


                            var resulst = await getRandomVongquay(req.user.server);
                            while (resulst.goldwin == 0) {
                                resulst = await getRandomVongquay(req.user.server);
                            }
                            console.log(resulst)

                            var goldwin = resulst.goldwin
                            var vitri = 3645 * resulst.winner.vitri1

                            if (typequay == "+") {
                                vitri = 3645 * resulst.winner.vitri2
                            }

                            await UserControl.upMoney(user._id, goldwin)
                            if (stttni.resetTT == true) {
                                await User.findByIdAndUpdate(user._id, { hanmuc: 0 })

                            }

                            await UserControl.sodu(user._id, "+" + numberWithCommas(goldwin), "Vòng quay may mắn")
                            const newLs = Vongquay({ phanthuong: resulst.winner.giai + " vàng", uid: user._id, name: user.tenhienthi })
                            const Lsnew = await newLs.save();
                            const data = {
                                modal: "<div class=\"modal fade\" tabindex=\"-1\" role=\"dialog\" id=\"modal\">\r\n  <div class=\"modal-dialog\" role=\"document\">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n        <h5 class=\"modal-title\">Thông báo</h5>\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n          <span aria-hidden=\"true\">&times;</span>\r\n        </button>\r\n      </div>\r\n      <div class=\"modal-body\">\r\n        Bạn nhận được <strong style='color: green'>" + resulst.winner.giai + " vàng</strong> từ <strong>vòng quay may mắn</strong>\r\n      </div>\r\n      <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Đóng</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>"
                                , script: "<script> $('#modal').modal('show'); </script>"
                                , status: 100
                                , transform: "rotate(" + typequay + vitri + "deg)"
                            }
                            res.send(data)
                        }
                    }
                }
            }
    } catch (err) { console.log(err) }
})
router.post('/nhanvip', rateSpamVip, async (req, res) => {
    //setTimeout(async () => {
    if (!req.user.isLogin) {
        var msss = 'Vui lòng đăng nhập';
        return res.send({ error: 1, message: msss })
    }
    var checkCaptcha = await CaptchaFunction.checkCaptcha(req.body.captcha, req.session.captcha);
    if (!checkCaptcha) {
        return res.send({ error: 1, message: "Bạn đã nhập sai captcha!" })
    }
    req.session.captcha = await CaptchaFunction.getRandomCap();


    var vipp = 0;
    var phanthuong = 0;

    var topup = await getVip(req.user._id.toString())

    if (topup >= 100000) {
        vipp = 1;
        phanthuong = 2000000
    }
    if (topup >= 500000) {
        vipp = 2;
        phanthuong = 7000000 * 2
    }
    if (topup >= 2000000) {
        vipp = 3;
        phanthuong = 35000000 * 2
    }
    if (topup >= 5000000) {
        vipp = 4;
        phanthuong = 100000000 * 2
    }
    if (topup >= 10000000) {
        vipp = 5;
        phanthuong = 225000000 * 2
    }
    if (topup >= 20000000) {
        vipp = 6;
        phanthuong = 500000000 * 2
    }
    if (topup >= 50000000) {
        vipp = 7;
        phanthuong = 2000000000 * 2
    }
    if (topup >= 100000000) {
        vipp = 8;
        phanthuong = 5000000000 * 2
    }
    if (topup < 100000) {
        var msss = 'Thật đáng tiếc, chức năng chỉ dành cho <strong class="text-danger">thành viên VIP</strong> !!!<br>Bạn cần nạp <strong class="text-danger">ít nhất 100k</strong> để được <strong class="text-danger">VIP</strong>';
        return res.send({ error: 1, message: msss })
    }
    var today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
    var d = new Date();
    d.setDate(new Date().getDate() + 1);
    var tomorrow = moment(d).format('YYYY-MM-DD[T00:00:00.000Z]');
    const checkVip = await User.findOne({ _id: req.user._id, timetopup: { $gte: new Date(today), $lt: new Date(tomorrow) } })
    if (!checkVip) {
        const updateeee = await User.findByIdAndUpdate({ _id: req.user._id }, { timetopup: new Date(today) }, { new: true })
        const ussss = await UserControl.upMoney(req.user._id, phanthuong);
        if (updateeee.vang + phanthuong != ussss.vang) {
            await UserControl.upMoney(req.user._id, -updateeee.vang);
        }
        const ussssz = await UserControl.sodu(req.user._id, "+" + numberWithCommas(phanthuong), "Nhận quà vip");
        var msss = '<div class="modal-body" id="result_qua">Bạn đang là <strong class="text-danger">thành viên VIP</strong>  <img src="images/vip/vip' + vipp + '.png" style=" max-width: 50px; height: auto" ;="" padding:="" 0;="" margin-bottom:="" 10px"="" alt=""> <hr class="mb-3"> Bạn nhận được <strong class="text-success"> ' + numberWithCommas(phanthuong) + ' vàng !!!</strong></div>';
        return res.send({ error: 1, message: msss })
    }
    return res.send({ error: 1, message: 'Bạn đang là <strong class="text-danger">thành viên VIP</strong>  <img src="images/vip/vip' + vipp + '.png" style=" max-width: 50px; height: auto" ;="" padding:="" 0;="" margin-bottom:="" 10px"="" alt=""> <hr class="mb-3"> Hôm nay bạn <strong class="text-success">đã nhận thưởng</strong> rồi!!! <br><strong class="text-danger ">Vui lòng chờ tới ngay mai!!!</strong>' })

    // }, getRandomIntInclusive(1000, 10000))
})

router.get('/setname', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    if (!req.user.tenhienthi || req.user.tenhienthi == null || req.user.tenhienthi == "") {
        res.render("index", { page: "pages/user/tenhienthi", data: req.user })
    }
    else {
        return res.redirect('/');

    }
})
var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

router.post('/setname', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    if (!req.user.tenhienthi || req.user.tenhienthi == null || req.user.tenhienthi == "") {

        if (req.body.name.length < 6 || req.body.name.length > 16) {
            res.send({ status: 0, message: "<h1 style='color:red'>Vui lòng nhập độ dài từ 6->16 kí tự<h1>" })
        }
        else if (!isHTML(req.body.name)) {
            const checkUser = await User.findOne({ $or: [{ tenhienthi: req.body.name }, { username: req.body.name }] })
            if (checkUser) {
                res.send({ status: 0, message: "<h1 style='color:red'>Tên này đã tồn tại trong hệ thống<h1>" })
            }
            else {
                const zzz = await User.findByIdAndUpdate(req.user._id, { tenhienthi: req.body.name })
                if (zzz) {
                    res.send({ status: 1, message: "" })
                }
                else {
                    res.send({ status: 0, message: "<h1 style='color:red'>Lỗi không xác định<h1>" })
                }
            }
        }
        else {
            res.send({ status: 0, message: "<h1 style='color:red'>Lỗi không xác định<h1>" })
        }
    }
})
router.get('/gifcode', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }

    res.render("index", { page: "pages/user/gifcode", data: req.user })
})
// new Gifcode({code:123123,phanthuong:9999999}).save()
// new Gifcode({code:12311123,phanthuong:9999999}).save()
// new Gifcode({code:1232212333,phanthuong:9999999}).save()
// new Gifcode({code:1231444423,phanthuong:9999999}).save()
router.post('/gifcode', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ error: 1, message: "Vui lòng đăng nhập!" })
    }
    if (req.body.gethistory) {
        if (req.body.type != 0 && req.body.type != 1) {
            return
        }
        var gcode = null;
        if (req.body.type == 0) {
            gcode = await Gifcode.find({ status: 1 }).sort({ time: -1 }).limit(7)
        }
        else {
            gcode = await Gifcode.find({ status: 1, name: req.user.tenhienthi }).sort({ time: -1 }).limit(7)
        }
        var table = "";
        gcode.forEach((item) => {
            table += '<tr><td>' + new Date(item.time).toLocaleString() + '</td><td>' + item.name + '</td><td>' + item.code + '</td><td>' + numberWithCommas(item.phanthuong) + '</td></tr>'
        })
        return res.send(table)
    }




    var checkCaptcha = await CaptchaFunction.checkCaptcha(req.body.captcha, req.session.captcha);

    if (!checkCaptcha) {
        //req.session.captcha = CaptchaFunction.getRandomCap();
        return res.send({ error: 1, message: "Bạn đã nhập sai captcha!" })
    }

    const code = req.body.code
    const gifcode = await Gifcode.findOneAndUpdate({ code: code, status: 0 }, { status: 1, name: req.user.tenhienthi }, { new: true })
    if (!gifcode) {
        req.session.captcha = await CaptchaFunction.getRandomCap();
        return res.send({ error: 1, message: "Gifcode không tồn tại hoặc đã sử dụng!" })
    }
    const upXu = await UserControl.upMoney(req.user._id, gifcode.phanthuong)
    const sodu = await UserControl.sodu(req.user._id, "+" + numberWithCommas(gifcode.phanthuong), "Nhập gifcode")
    req.session.captcha = await CaptchaFunction.getRandomCap();
    return res.send({ error: 0, message: "Bạn đã nhập gifcode và nhận " + numberWithCommas(gifcode.phanthuong) + " vàng" })
})







router.get('/imageGen', async function (req, res, next) {

    var c = new Captcha({
        length: 5, // Captcha length
        size: {    // output size
            width: 450,
            height: 200
        }
    });

    req.session.captcha = await CaptchaFunction.mahoaCaptcha(c.value);


    c.toBase64(function (err, base64) {
        base64Data = base64.replace(/^data:image\/png;base64,/, "");
        base64Data += base64Data.replace('+', ' ');
        //console.log(base64Data);
        binaryData = Buffer.from(base64Data, 'base64').toString('binary');
        if (err) {
            //console.log("Captcha Error");
            //console.log(err);
        }
        else {
            res.contentType('image/png');
            res.end(binaryData, 'binary');
        }
    });
});

router.get('/xosokeno', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    res.render("index", { page: "pages/user/xosokeno", data: req.user })
})

router.get('/thumua', async (req, res, next) => {
    if (!req.user.isLogin) {
        return res.redirect('/user/login');
    }
    const chietkhau = await ChietKhau.findOne({ server: req.user.server })
    res.render("index", { page: "pages/user/thumua", data: req.user })
})




router.post('/vongquayfree', async (req, res) => {
    if (!req.user.isLogin) {
        const data = {
            message: "Vui lòng đăng nhập", status: 0
        }
        return res.send(data)
    }




    const action = req.body.action
    if (action == "submit") {
        const user = await User.findById(req.user._id)
        if (user) {

            var today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
            var d = new Date();
            d.setDate(new Date().getDate() + 1);
            var tomorrow = moment(d).format('YYYY-MM-DD[T00:00:00.000Z]');



            var now = new Date();
            var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            var countcuoc = 0;
            var countnap = 0;

            const cuocs = await Cuoc.countDocuments({ uid: user._id, status: { $ne: 5 }, time: { $gte: startOfToday } })
            // const cuockenos = await Cuockeno.countDocuments({ uid: user._id, status: { $ne: 5 }, time: { $gte: startOfToday } })
            const cuoctxs = await Cuoctx.countDocuments({ uid: user._id.toString(), time: { $gte: startOfToday } })

            // const tsrr = await Tsr.countDocuments({ uid: user._id, time: { $gte: startOfToday } })
            // const momoo = await Momo.countDocuments({ sotien: { $gt: 9999 }, uid: user._id, time: { $gte: startOfToday } })
            // const cardd = await Card.countDocuments({ uid: user._id, status: 1, time: { $gte: startOfToday } })

            //const napvangg = await Napvang.countDocuments({ uid: user._id, status: 1, time: { $gte: startOfToday } })

            //countnap = tsrr + momoo + cardd

            countcuoc = cuocs + cuoctxs

            if (countcuoc < 10) {
                const data = {
                    message: "Bạn cần pem trên 10 ván để quay", status: 0
                }
                return res.send(data)
            }



            var topup = await getVip(req.user._id.toString())

            if (topup < 100000) {
                return res.send({ status: 0, message: "Chỉ thành viên vip mới có thể quay!" })
            }



            const checkkkkk = await User.findOne({ _id: req.user._id, timequayfree: { $gte: new Date(today), $lt: new Date(tomorrow) } })
            if (!checkkkkk) {
                const updateeee = await User.updateOne({ _id: req.user._id }, { timequayfree: new Date(today) })
                const typequay = "+"
                var giaiii = [
                    { vitri: getRandomIntInclusive(25, 50), pct: 0, giai: "Bạn nhận được 200 kim cương 😄😄😄", type: 1 },
                    { vitri: getRandomIntInclusive(65, 90), pct: 0, giai: "Bạn nhận được 100 kim cương 😄😄😄", type: 2 },
                    { vitri: getRandomIntInclusive(100, 125), pct: 1, giai: "Bạn nhận được 50 kim cương 😄😄😄", type: 3 },
                    { vitri: getRandomIntInclusive(133, 165), pct: 1, giai: "Bạn nhận được 20 kim cương 😄😄😄", type: 4 },
                    { vitri: getRandomIntInclusive(175, 205), pct: 1, giai: "Bạn nhận được 10 kim cương 😄😄😄", type: 5 },
                    { vitri: getRandomIntInclusive(215, 245), pct: 5, giai: "Bạn nhận được 7 kim cương 😄😄😄", type: 6 },
                    { vitri: getRandomIntInclusive(260, 290), pct: 11, giai: "Bạn nhận được 5 kim cương 😄😄😄", type: 7 },
                    { vitri: getRandomIntInclusive(299, 335), pct: 32, giai: "Bạn nhận được 3 kim cương 😄😄😄", type: 8 },
                    { vitri: getRandomIntInclusive(345, 375), pct: 49, giai: "Bạn nhận được 1 kim cương 😄😄😄", type: 9 }
                ];
                const expanded = giaiii.flatMap(giai => Array(giai.pct).fill(giai));
                const winner = expanded[Math.floor(Math.random() * expanded.length)];
                var goldwin = 0;
                if (winner.type == 1) goldwin = 0;
                else if (winner.type == 2) goldwin = 100;
                else if (winner.type == 3) goldwin = 50;
                else if (winner.type == 4) goldwin = 20;
                else if (winner.type == 5) goldwin = 10;
                else if (winner.type == 6) goldwin = 7;
                else if (winner.type == 7) goldwin = 5;
                else if (winner.type == 8) goldwin = 3;
                else if (winner.type == 9) goldwin = 1;
                if (winner.type != 1) {
                    await UserControl.upKimcuong(user._id, goldwin)
                    await UserControl.sodu(user._id, "+" + goldwin + " Kim cương", "Vòng quay may mắn")
                }
                try {
                    const newLs = Vongquayfree({ phanthuong: winner.giai + " kim cương", uid: user._id, name: user.username })
                    const Lsnew = await newLs.save();
                } catch { }
                const data = {
                    message: winner.giai
                    , status: 100
                    , transform: "rotate(" + Number(360 * 10 + winner.vitri) + "deg)"
                }
                return res.send(data)
            }
            else {
                const data = {
                    message: "Hôm nay bạn đã quay rồi vui lòng đợi ngày mai"
                    , status: 0
                }
                return res.send(data)
            }
        }
        else {
            const data = {
                message: "Vui lòng đăng nhập", status: 0
            }
            return res.send(data)
        }
    }
    else {
        const data = {
            message: "Lỗi", status: 0
        }
        return res.send(data)
    }
})










module.exports = router