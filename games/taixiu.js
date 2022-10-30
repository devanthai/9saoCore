


const Cuoctx = require("../models/taixiu/Cuoc")
const Gametx = require("../models/taixiu/Game")
const Setting = require("../models/Setting")
const Lichsutx = require("../models/taixiu/Lichsu")
const HuTx = require("../models/taixiu/HuTx")
const User = require("../models/User")
const UserControl = require("../controller/user")
const checklogin = require("../Middleware/checklogin")
var ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment')
const rateLimit = require('express-rate-limit')
const fs = require('fs');

var vangtaiiiiiiiii = 0
var vangxiiiiuuuuuuu = 0
var timeeeeeeeeee = 0


const redisClient = require("../redisCache")
const keyDragon = "dragonTaiXiu"
getDragonBoy = async (uid) => {
    const dragon = await redisClient.get(keyDragon + uid.toString())
    if (dragon) {
        let jsonDragon = JSON.parse(dragon)
        return { thua: jsonDragon.thua, thang: jsonDragon.thang }
    }
    else {
        return setDragonBoy(uid, "kkk")
    }
}
setDragonBoy = async (uid, type) => {
    let keyUser = keyDragon + uid.toString()
    const dragon = await redisClient.get(keyUser)
    if (dragon) {
        let jsonDragon = JSON.parse(dragon)
        if (type == "thua") {
            if (jsonDragon.thang > 0) {
                jsonDragon.thua = 0
                jsonDragon.thang = 0
            }
            else {
                jsonDragon.thua += 1
            }
        }
        else if (type == "thang") {
            if (jsonDragon.thua > 0) {
                jsonDragon.thang = 0
                jsonDragon.thua = 0
            }
            else {
                jsonDragon.thang += 1
            }
        }
        else {
            jsonDragon.thua = 0
            jsonDragon.thang = 0
        }
        await redisClient.set(keyUser, JSON.stringify(jsonDragon))
        return { thua: jsonDragon.thua, thang: jsonDragon.thang }
    }
    else {
        let thua = 0
        let thang = 0
        if (type == "thua") {
            thang = 0
            thua += 1
        }
        else if (type == "thang") {
            thua = 0
            thang += 1
        }
        else {
            thua = 0
            thang = 0
        }
        await redisClient.set(keyUser, JSON.stringify({ thua: thua, thang: thang }))
        return { thua: thua, thang: thang }
    }
}

const createAccountLimiter = rateLimit({
    windowMs: 2000, // 1 minit
    max: 1, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message: `spaming`,
    handler: (request, response, next, options) =>
        response.status(200).send({ error: 1, message: "Từ từ thôi má" }),

    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


const PlayerSocket = require('./PlayerSocket')

class GameTaiXiu {


    getTaixiu = () => {
        return { vangtai: vangtaiiiiiiiii, vangxiu: vangxiiiiuuuuuuu, time: timeeeeeeeeee }
    }

    getPlayercount = () => {
        return PlayerSocket.SocketPlayer.length
    }
    taixiu = (io, app) => {


        var Cuocs = []


        app.get("/taixiu/getgame", async (req, res) => {
            const file = `./views/taixiu/taixiuthai.ejs`;
            fs.readFile(file, async function (err, data) {
                res.send(data);
            })
        })
        app.get("/taixiu/getPoke", async (req, res) => {
            const file = `./views/taixiu/minipoke.ejs`;
            fs.readFile(file, async function (err, data) {
                res.send(data);
            })
        })
        app.get("/taixiu/getLuckyWild", async (req, res) => {
            const file = `./views/taixiu/hoaqua.ejs`;
            fs.readFile(file, async function (err, data) {
                res.send(data);
            })
        })
        app.get("/taixiu/baotri", async (req, res) => {
            isBaotri = !isBaotri
            res.send(isBaotri)
        })
        app.get("/taixiu/getcuoc", async (req, res) => {
            const gamess = await Cuoctx.find({}, 'nhanvat time vangdat vangnhan status type').sort({ 'time': -1 }).limit(50)
            res.send(gamess)
        })
        app.get("/taixiu/gethis", async (req, res) => {
            const gamess = await Gametx.find({}, 'ketqua x1 x2 x3').sort({ $natural: -1 }).limit(13)
            res.send(gamess)
        })

        app.post("/taixiu/putcuoc", createAccountLimiter, checklogin, async (req, res) => {

            if (isBaotri) {
                return res.send({ error: 1, message: "Bảo trì trong giây lát" })
            }

            var vangcuoc = req.body.vangcuoc
            var type = req.body.type
            if (req.session.time) {
                if (timeSince(req.session.time) < 1) {
                    return res.send({ error: 1, message: "Thao tác quá nhanh" })
                }
            }
            req.session.time = Date.now()
            const gold2 = Number(vangcuoc.replace(/,/g, ''))

            if (!req.user.isLogin) {
                return res.send({ error: 1, message: "Vui lòng đăng nhập" });
            }
            else {
                const user = await User.findOne({ _id: req.session.userId })
                if (!user) {
                    return res.send({ error: 1, message: "Lỗi không xác định" });
                }
                if (vangcuoc === "" || type === "") {
                    return res.send({ error: 1, message: "Lỗi không xác định" });
                }
                else if (isNaN(gold2)) {
                    return res.send({ error: 1, message: "Lỗi không xác định" });
                }

                else if (type != "tai" && type != "xiu") {
                    return res.send({ error: 1, message: "Vui lòng chọn lại" });
                }
                else if (gold2 < 3000000) {
                    return res.send({ error: 1, message: "Chỉ được đặt trên 3tr" });
                }
                else if (user.vang < gold2) {
                    return res.send({ error: 1, message: "Bạn không đủ vàng để đặt" });
                }



                if (Game.Time < 1) {
                    return res.send({ error: 1, message: "Hết thời gian đặt cược" });
                }


                var check2dor = false

                for (let i = 0; i < Cuocs.length; i++) {
                    // console.log(Cuocs[i])
                    if (Cuocs[i].type != type && user._id.toString() == Cuocs[i].userId.toString()) {
                        check2dor = true
                        break
                    }
                }


                if (check2dor) {
                    return res.send({ error: 1, message: "Không được đặt 2 cửa" });
                }
                var check = await UserControl.upMoney(user._id, -gold2)
                if (check) {
                    if (check.vang < 0) {
                        return res.send({ error: 1, message: "Đặt cược không thành công" });
                    }
                    var checklastcuoc = await Cuoctx.findOneAndUpdate({ status: -1, uid: new ObjectId(user._id) }, { $inc: { vangdat: gold2 } })
                    if (!checklastcuoc) {
                        const addCuoc = new Cuoctx({ vangdat: gold2, uid: user._id, nhanvat: user.tenhienthi, type: type })

                        var savecuoc = null;
                        try {
                            const savedCuoc = await addCuoc.save()
                            savecuoc = savedCuoc
                        }
                        catch (err) {

                            console.log(err)
                        }
                    }



                    const thanhtich = await UserControl.upThanhtich(user._id, gold2)
                    const uphanmuc = await UserControl.upHanmuc(user._id, gold2, req.user.server)




                    await UserControl.sodu(user._id.toString(), "Cược game tài xỉu", "-" + numberWithCommas(gold2))





                    if (type == "tai") {
                        Game.VangTai += gold2
                        AddCuocs(user._id, "tai", gold2, user)
                    }
                    else if (type == "xiu") {
                        Game.VangXiu += gold2
                        AddCuocs(user._id, "xiu", gold2, user)
                    }


                    const percentHu = Math.round(Number(gold2 / 0.995)) - gold2
                    Game.Hu += percentHu

                    //Hux tai xiu
                    var hutx = await HuTx.findOne({}).sort({ time: -1 })
                    if (!hutx) {
                        hutx = new HuTx({ vanghu: percentHu })
                    }
                    else {
                        hutx.vanghu += percentHu
                    }
                    hutx.save()
                    //Hux tai xiu

                    return res.send({ error: 0, message: "Đặt cược thành công" });
                }
            }
        })
        app.get("/taixiu/gameplay.txt", (req, res) => {
            if (req.query.how = "kteam") {
                res.send(PlayerSocket.SocketPlayer)
            }

        })
        app.get("/taixiu/check", (req, res) => {

            console.log("cc")
        })
        app.post("/taixiu/getHisNohu", async (req, res) => {
            const zzz = await HuTx.findOne({ playerWin: { $ne: null } }).sort({ time: -1 })
            res.send(zzz)
        })

        function timeSince(date) {

            var seconds = Math.floor((new Date() - date) / 1000);
            return Math.floor(seconds)
        }
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }


        var isBaotri = false;


        async function NoHuTaiXiu(cuocs) {
            console.log("Nổ hũ")
            const moneyHu = Game.Hu
            const tienCuoc = Game.VangTai + Game.VangXiu
            var playerWins = []
            cuocs.forEach(async (cuoc) => {
                const vangWinHu = Math.round((moneyHu * cuoc.xu) / tienCuoc)
                playerWins.push({ ...cuoc, vangWinHu })
                await UserControl.sodu(cuoc.userId, "Nổ hũ tài xíu", "+" + numberWithCommas(vangWinHu))
                await UserControl.upMoney(cuoc.userId, vangWinHu)
            })
            var goldHux = 999999999


            await HuTx.findOneAndUpdate({ playerWin: playerWins }).sort({ time: -1 })


            await new HuTx({ vanghu: goldHux }).save()
            Game.Hu = goldHux
            for (var i = 0; i < cuocs.length; i++) {
                var cuoc = cuocs[i];
                try {
                    const vangWinHu = Math.round((moneyHu * cuoc.xu) / tienCuoc)
                    var socket = PlayerSocket.SocketPlayer.find(player => player.userId.toString() === cuoc.userId.toString());
                    io.to(socket.socket).emit('trunghu', { vangWinHu: vangWinHu });
                } catch { }
            }
        }

        async function TraoThuong(ketqua, x1, x2, x3, cuocs) {

            var cuocssss = cuocs
            const setting = await Setting.findOne({ setting: "setting" })
            var istai = ketqua > 10
            console.log("x1 ", x1, " x2 ", x2, " x3", x3)
            console.log("ketqua: ", ketqua, " istai: " + istai)
            await new Gametx({ ketqua: ketqua, type: (istai ? "tai" : "xiu"), status: 1, x1: x1, x2: x2, x3: x3 }).save()
            cuocssss.forEach(async (cuoc) => {
                console.log(cuocssss)
                var vangnhan = 0
                console.log(cuoc.type, istai)
                console.log("thang ", cuoc.type == (istai ? "tai" : "xiu"))
                if (cuoc.type == (istai ? "tai" : "xiu")) {
                    vangnhan = cuoc.xu * setting.tile.cltx;
                    await UserControl.upMoney(cuoc.userId, vangnhan)
                    await UserControl.sodu(cuoc.userId, "Thắng game tài xỉu", "+" + numberWithCommas(vangnhan))
                    await Cuoctx.updateMany({ uid: new ObjectId(cuoc.userId), status: -1 }, { status: 1, ketqua: ketqua, vangnhan: vangnhan })
                    await new Lichsutx({ uid: cuoc.userId, status: 1, ketqua: ketqua, vangnhan: vangnhan, type: cuoc.type, vangdat: cuoc.xu }).save()
                    await setDragonBoy(cuoc.userId, "thang")
                }
                else {
                    var user = await UserControl.upMoney(cuoc.userId, vangnhan)
                    await UserControl.upHanmuc(cuoc.userId, -cuoc.xu, user.server)
                    await Cuoctx.updateMany({ uid: new ObjectId(cuoc.userId), status: -1 }, { status: 2, ketqua: ketqua, vangnhan: vangnhan })
                    await new Lichsutx({ uid: cuoc.userId, status: 2, ketqua: ketqua, vangnhan: vangnhan, type: cuoc.type, vangdat: cuoc.xu }).save()
                    await setDragonBoy(cuoc.userId, "thua")
                }
            })
            WinGame(ketqua)


            // x1 = 1//
            // x2 = 1//
            // x3 = 1//
            if ((x1 + x2 + x3 == 3) || (x1 + x2 + x3 == 18)) {
                NoHuTaiXiu(cuocssss)
            }
        }
        function AddCuocs(userId, type, xu, user) {
            if (Cuocs.some(cuoc => cuoc.userId.toString() === userId.toString() && cuoc.type === type)) {
                updateCuoc(userId.toString(), type, xu)
            }
            else {
                if (type == "tai") {
                    Game.UserTai += 1

                }
                else if (type == "xiu") {
                    Game.UserXiu += 1

                }
                Cuocs.push({
                    userId: userId.toString(),
                    type: type,
                    xu: xu,
                    username: user.tenhienthi
                })
            }

        }
        function updateCuoc(userId, type, xu) {
            for (var i in Cuocs) {
                if (Cuocs[i].userId.toString() == userId.toString() && Cuocs[i].type == type) {
                    Cuocs[i].xu += + xu;
                    break;
                }
            }
        }

        function getxuCuoc(userId, type) {
            var xu = 0;
            for (var i = 0; i < Cuocs.length; i++) {
                var cuoc = Cuocs[i];
                if (userId.toString() == cuoc.userId.toString() && cuoc.type == type) {
                    xu = cuoc.xu;
                    break
                }
            }
            return xu;
        }
        function WinGame(ketqua) {
            setTimeout(() => {
                var type = ketqua > 10 ? "tai" : "xiu";
                for (var i = 0; i < Cuocs.length; i++) {
                    var cuoc = Cuocs[i];
                    try {
                        var socket = PlayerSocket.SocketPlayer.find(player => player.userId.toString() === cuoc.userId.toString());
                        try {
                            if (cuoc.type == type) {

                                io.to(socket.socket).emit('traothuong', { status: "win", message: "+" + numberWithCommas(cuoc.xu) });

                            }
                            else {
                                io.to(socket.socket).emit('traothuong', { status: "thua", message: "-" + numberWithCommas(cuoc.xu) });
                            }
                        } catch { }
                    } catch { }
                }

            }, Game.TimeWait * 1000)

        }




        var Game = {
            Hu: 0,
            VangTai: 0,
            VangXiu: 0,
            UserTai: 0,
            UserXiu: 0,
            Time: 0,
            TimeWait: 0,
            Status: "start",
            x1: -1,
            x2: -1,
            x3: -1

        }

        //Hu taixiu
        HuTx.findOne({}, null, { sort: { time: -1 } }, (error, data) => {
            Game.Hu = data ? Game.Hu = data.vanghu : Game.Hu = 0
        })
        //Hu taixiu


        function GameStart() {
            Game.VangTai = 0
            Game.VangXiu = 0
            Game.UserTai = 0
            Game.UserXiu = 0
            //Game.Time = 10,
            Game.Time = 35
            Game.TimeWait = 15
            Game.Status = "running"
            Game.x1 = -1
            Game.x2 = -1
            Game.x3 = -1
            Cuocs = []
        }

        setInterval(() => {
            timeeeeeeeeee = Game.Time
            vangtaiiiiiiiii = Game.VangTai
            vangxiiiiuuuuuuu = Game.VangXiu
            if (Game.Status == "start") {

                GameStart()
            }
            else if (Game.Status == "running") {
                var len = 0;
                for (var i = 0, len = PlayerSocket.SocketPlayer.length; i < len; ++i) {

                    var p = PlayerSocket.SocketPlayer[i];
                    var xuTaii = 0;
                    try {
                        xuTaii = getxuCuoc(p.userId, "tai")
                    }
                    catch {

                    }

                    var xuXiuu = 0;

                    try {
                        xuXiuu = getxuCuoc(p.userId, "xiu")
                    }
                    catch {

                    }


                    try {
                        getDragonBoy(p.userId).then(data => {
                            //console.log(data)
                        })
                        io.to(p.socket).emit('usercuoc', { cuocTai: xuTaii, cuocXiu: xuXiuu });
                    } catch { }
                } try {
                    io.sockets.emit("running", { Hu: Game.Hu, time: Game.Time, userxiu: Game.UserXiu, usertai: Game.UserTai, vangtai: Game.VangTai, vangxiu: Game.VangXiu });
                } catch { }
                Game.Time--
                if (Game.Time <= -1) {
                    // Game.x1 == -1 ? (Game.x1 = (Math.floor(Math.random() * 6) + 1)) : (Game.x1 = Game.x1)
                    // Game.x2 == -1 ? (Game.x2 = (Math.floor(Math.random() * 6) + 1)) : (Game.x2 = Game.x2)
                    // Game.x3 == -1 ? (Game.x3 = (Math.floor(Math.random() * 6) + 1)) : (Game.x3 = Game.x3)

                    Game.x1 = Math.floor(Math.random() * 6) + 1
                    Game.x2 = Math.floor(Math.random() * 6) + 1
                    Game.x3 = Math.floor(Math.random() * 6) + 1

                    if (new Date().getTime() % 2 == 0 && (Game.x1 + Game.x2 + Game.x3 == 3) || (Game.x1 + Game.x2 + Game.x3 == 18)) {
                        Game.x1 = Math.floor(Math.random() * 6) + 1
                        Game.x2 = Math.floor(Math.random() * 6) + 1
                        Game.x3 = Math.floor(Math.random() * 6) + 1
                    }

                    if (new Date().getTime() % 2 == 0) {
                        if (Game.VangTai > 50000000000) {
                            while (Game.x1 + Game.x2 + Game.x3 > 10) {
                                Game.x1 = Math.floor(Math.random() * 6) + 1
                                Game.x2 = Math.floor(Math.random() * 6) + 1
                                Game.x3 = Math.floor(Math.random() * 6) + 1
                            }
                        }
                        else if (Game.VangXiu > 50000000000) {
                            while (Game.x1 + Game.x2 + Game.x3 < 11) {
                                Game.x1 = Math.floor(Math.random() * 6) + 1
                                Game.x2 = Math.floor(Math.random() * 6) + 1
                                Game.x3 = Math.floor(Math.random() * 6) + 1
                            }
                        }
                    }


                    try {


                        io.sockets.emit("ketqua", { time: Game.Time, userxiu: Game.UserXiu, usertai: Game.UserTai, vangtai: Game.VangTai, vangxiu: Game.VangXiu, ketqua: { x1: Game.x1, x2: Game.x2, x3: Game.x3 } });
                    } catch { }
                    //TraoThuong(Number(Game.x1 + Game.x2 + Game.x3), 2, 2, 2, Cuocs)

                    TraoThuong(Number(Game.x1 + Game.x2 + Game.x3), Game.x1, Game.x2, Game.x3, Cuocs)
                    Game.Status = "waitgame"
                }
            }
            else if (Game.Status == "waitgame") {
                try {
                    io.sockets.emit("waitgame", { time: Game.TimeWait, userxiu: Game.UserXiu, usertai: Game.UserTai, vangtai: Game.VangTai, vangxiu: Game.VangXiu, ketqua: { x1: Game.x1, x2: Game.x2, x3: Game.x3 } });
                } catch { }
                Game.TimeWait--
                if (Game.TimeWait <= -1) {
                    Game.Status = "start"
                }

            }
        }, 1000)
    }
}

module.exports = new GameTaiXiu