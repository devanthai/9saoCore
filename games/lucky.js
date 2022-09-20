var LuckyPlayer = require("../models/Luckyplayer")
var Diemdanh = require("../models/Diemdanh")
const checklogin = require("../Middleware/checklogin")
const User = require("../models/User")
const UserControl = require("../controller/user")
const Cuoc = require('../models/Cuoc')
const PlayerSocket = require('./PlayerSocket')
const CaptchaFunction = require('../controller/CaptchaFunction');
const checkVip = require('../controller/getVip');
const rateLimit = require('express-rate-limit')

const createAccountLimiterz = rateLimit({
    windowMs: 5000, // 1 minit
    max: 1, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message: `spaming`,
    handler: (request, response, next, options) =>
        response.status(200).send({ error: 1, message: "Từ từ thôi má" }),

    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

class GameLucky {
    gamestart = (io, app) => {

        function timeSince(date) {
            var seconds = Math.floor((new Date() - date) / 1000);
            return Math.floor(seconds)
        }
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        var isbaotri = false
        app.get("/minigame/baotri", (req, res) => {

            isbaotri = !isbaotri
            return res.send(isbaotri)
        })
        app.get("/minigame/settime", (req, res) => {

            var time = req.query.time
            if (!isNaN(time)) {


                Time = time
            }
            return res.send(Time)
        })
        app.post("/minigame/thamgia", createAccountLimiterz, checklogin, async (req, res) => {



            try {

                var captcha = req.body.captcha

                //var captchasess = req.session.captcha

                // const checkCaptcha = await CaptchaFunction.checkCaptcha(captcha, captchasess);
                // if (!checkCaptcha) {
                //     return res.send({ error: 1, message: "Bạn đã nhập sai captcha vui lòng kiểm tra lại" })
                // }


                var timeNow = new Date()
                if (timeNow.getTime() - req.session.timePick < 2000 && req.session.timePick) {
                    return res.send({ error: 1, message: "Thao tác quá nhanh" })
                }
                req.session.timePick = timeNow.getTime()
                var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

                if (isbaotri) {
                    return res.send({ error: 1, message: "Bảo trì trong giây lát" })
                }
                if (!req.user.isLogin) {
                    return res.send({ error: 1, message: "Vui lòng đăng nhập" })
                }

                var topup = await checkVip(req.user._id)
                if (topup < 100000) {
                    return res.send({ error: 1, message: "Chỉ thành viên vip mới được tham gia!" })
                }

                if (req.session.time) {
                    if (timeSince(req.session.time) < 2) {
                        return res.send({ error: 1, message: "Thao tác quá nhanh" })
                    }
                }

                if (PlayersThamGia.some(player => player.uid.toString() === req.user._id.toString())) {
                    return res.send({ error: 1, message: "Bạn đang tham gia rồi vui lòng chờ kết quả nhé" })
                }

                // if (PlayersThamGia.some(player => player.ip === ip)) {
                //     for (let i = 0; i < PlayersThamGia.length; i++) {

                //         if (PlayersThamGia[i].uid.toString() != req.user._id.toString() && PlayersThamGia[i].ip == ip) {
                //             Vangthuong -= 1000000
                //             PlayersThamGia.splice(i, 1);
                //         }
                //     }
                // }

                PlayersThamGia.push({ uid: req.user._id, name: req.user.tenhienthi, ip: ip })
                Vangthuong += 1000000
                //io.sockets.emit("logspickme", user.user.username + " đã tham gia")
                //req.session.captcha = await CaptchaFunction.getRandomCap();
                return res.send({ error: 0, message: "Tham gia thành công cùng chờ kết quả nhé" })

            } catch { }
            res.send({ error: 1, message: "Lỗi không xác định" })
        })
        app.post("/minigame/thamgiadiemdanh", createAccountLimiterz, checklogin, async (req, res) => {
            try {
                var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
                //var captcha = req.body.captcha

                //var captchasess = req.sessio n.captcha

                //  const checkCaptcha = await CaptchaFunction.checkCaptcha(captcha, captchasess);
                //   if (!checkCaptcha) {
                //      return res.send({ error: 1, message: "Bạn đã nhập sai captcha vui lòng kiểm tra lại" })
                //   }

                var timeNow2 = new Date()
                if (timeNow2.getTime() - req.session.timePickMe < 2000 && req.session.timePickMe) {
                    return res.send({ error: 1, message: "Thao tác quá nhanh" })
                }
                req.session.timePickMe = timeNow2.getTime()


                if (isbaotri) {
                    return res.send({ error: 1, message: "Bảo trì trong giây lát" })
                }
                if (!req.user.isLogin) {
                    return res.send({ error: 1, message: "Vui lòng đăng nhập" })
                }

                // var topup = await checkVip(req.user._id)
                // if (topup < 100000) {
                //     return res.send({ error: 1, message: "Chỉ thành viên vip mới được tham gia!" })
                // }
                if (req.session.time) {
                    if (timeSince(req.session.time) < 2) {
                        return res.send({ error: 1, message: "Thao tác quá nhanh" })
                    }
                }
                req.session.time = Date.now()
                if (PlayerDiemDanh.some(player => player.uid.toString() === req.user._id.toString())) {
                    return res.send({ error: 1, message: "Bạn đang tham gia rồi vui lòng chờ kết quả nhé" })
                }

                // if (PlayerDiemDanh.some(player => player.ip === ip)) {
                //     for (let i = 0; i < PlayerDiemDanh.length; i++) {

                //         if (PlayerDiemDanh[i].uid.toString() != req.user._id.toString() && PlayerDiemDanh[i].ip == ip) {

                //             PlayerDiemDanh.splice(i, 1);
                //         }
                //     }
                // }


                PlayerDiemDanh.push({ uid: req.user._id, name: req.user.tenhienthi, ip: ip })
                PlayerDiemDanh2.push({ name: req.user.tenhienthi })
                // req.session.captcha = await CaptchaFunction.getRandomCap();

                // io.sockets.emit("logsdiemdanh", req.user.name + " đã tham gia")
                return res.send({ error: 0, message: "Tham gia thành công cùng chờ kết quả nhé" })

            } catch { }
            res.send({ error: 1, message: "Lỗi không xác định" })
        })

        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        var PlayersThamGia = []
        var Time = 3600

        var Vangthuong = 0
        var LastWin
        LuckyPlayer.find({}).sort({ time: -1 }).limit(10).exec(function (err, last) {
            LastWin = last
        });
        async function traothuong(player, Vangthuongz) {
            try {
                var now = new Date();
                var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                // const cuocs = await Cuoc.countDocuments({ uid: player.uid, status: { $ne: 5 }, time: { $gte: startOfToday } })
                const user = await User.findById(player.uid)

                if (user.thanhtichngay > 50000000) {
                    LastWin.push({ name: player.name, vang: Vangthuongz })
                    await new LuckyPlayer({ name: player.name, vang: Vangthuongz }).save()
                    await UserControl.upMoney(player.uid, Vangthuongz)
                    await UserControl.sodu(player.uid, "THẮNG PICKME", "+" + numberWithCommas(Vangthuongz))
                    var socket = PlayerSocket.SocketPlayer.find(playerz => playerz.userId.toString() === player.uid.toString()).socket;
                    io.to(socket).emit("youarewinner", Vangthuongz);
                }
            } catch {
            }
        }
        setInterval(() => {
            Time--
            if (Time <= 0) {
                if (PlayersThamGia.length > 0) {
                    LastWin = []
                    var percent = 20
                    var countPlaterWin = Math.round(PlayersThamGia.length / percent)
                    if (PlayersThamGia.length < percent) {
                        countPlaterWin = 1
                    }
                    Vangthuong = Vangthuong / countPlaterWin
                    var lastIndexP = []
                    for (var i = 0; i < countPlaterWin; i++) {
                        try {
                            var pl1 = getRandomIntInclusive(0, PlayersThamGia.length - 1)
                            var counti = 0
                            while (lastIndexP.includes(pl1)) {
                                pl1 = getRandomIntInclusive(0, PlayersThamGia.length - 1)
                                counti++
                                if (counti > 5) break
                            }
                            try {

                                counti = 0
                                while (lastIndexP.includes(pl1)) {
                                    pl1 = getRandomIntInclusive(0, PlayersThamGia.length - 1)
                                    counti++
                                    if (counti > 5) break
                                }

                                lastIndexP.push(pl1)
                                traothuong(PlayersThamGia[pl1], Vangthuong)

                            } catch { }
                        } catch { }
                    }
                }
                Time = 3600
                Vangthuong = 0
                PlayersThamGia = []
            }
            try {
                io.sockets.emit("pickme", { lastwindiemdanh: DiemDanhLastWin, countPlayerDiemdanh: PlayerDiemDanh.length, TimeDiemDanh: TimeDiemDanh, time: Time, countPlayer: PlayersThamGia.length, vangthuong: numberWithCommas(Vangthuong), lastwiner: LastWin })
            } catch { }
        }, 1000)
        async function traothuongdiemdanh(player) {
            try {
                var now = new Date();
                var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                // const cuocs = await Cuoc.countDocuments({ uid: player.uid, status: { $ne: 5 }, time: { $gte: startOfToday } })
                const user = await User.findById(player.uid)

                if (user.thanhtichngay > 50000000) {

                    var vangthuong = getRandomIntInclusive(1000000, 6000000)
                    var kimcuong = getRandomIntInclusive(1, 6)

                    DiemDanhLastWin.push({ name: player.name })
                    await new Diemdanh({ name: player.name }).save()
                    await UserControl.upMoney(player.uid, vangthuong)
                    await UserControl.upKimcuong(player.uid, kimcuong)
                    await UserControl.sodu(player.uid, "Điểm danh", "+" + numberWithCommas(vangthuong))

                }
            } catch {
            }
        }

        const TimeDiemDanhG = 900
        var TimeDiemDanh = 900
        var PlayerDiemDanh = []
        var PlayerDiemDanh2 = []
        var DiemDanhLastWin = []
        var IsPending = false
        Diemdanh.find({}).sort({ time: -1 }).limit(10).exec(function (err, last) {
            DiemDanhLastWin = last
        });
        setInterval(() => {
            if (TimeDiemDanh > 0) {
                TimeDiemDanh--
            }

            if (TimeDiemDanh <= 0 && !IsPending) {
                IsPending = true
                // console.log(PlayerDiemDanh.length)
                if (PlayerDiemDanh.length >= 20) {
                    DiemDanhLastWin = []
                    io.sockets.emit("datawin", PlayerDiemDanh2)

                    for (var i = 0; i < 10; i++) {
                        var pl1 = getRandomIntInclusive(0, PlayerDiemDanh.length - 1)
                        traothuongdiemdanh(PlayerDiemDanh[pl1])
                    }
                }


                setTimeout(() => {
                    IsPending = false
                    TimeDiemDanh = TimeDiemDanhG
                    PlayerDiemDanh2 = []
                    PlayerDiemDanh = []
                }, 5000);

            }



        }, 1000)
    }
}
module.exports = new GameLucky