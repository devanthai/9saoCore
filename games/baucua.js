const CuocBC = require("../models/baucua/Cuoc")
const GameBaucua = require("../models/baucua/Game")
const Setting = require("../models/Setting")
const LichsuBaucua = require("../models/baucua/Lichsu")
const User = require("../models/User")
const UserControl = require("../controller/user")
const checklogin = require("../Middleware/checklogin")
var ObjectId = require('mongoose').Types.ObjectId;
const { FORMERR } = require("dns")
const PlayerSocket = require('./PlayerSocket')
const rateLimit = require('express-rate-limit')
const fs = require('fs');

const cuocbaucualimit = rateLimit({
    windowMs: 10000, // 1 minit
    max: 1, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message: `spaming`,
    handler: (request, response, next, options) =>
        response.status(200).send({ error: 1, message: "Từ từ thôi má" }),

    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


class GameBauCua {

    baucua = (io, app) => {


        function timeSince(date) {
            var seconds = Math.floor((new Date() - date) / 1000);
            return Math.floor(seconds)
        }
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }


        var Cuocs = []
        var isBaotri = false;
        async function TraoThuong(x1, x2, x3) {
            const setting = await Setting.findOne({ setting: "setting" })
            await new GameBaucua({ status: 1, x1: x1, x2: x2, x3: x3 }).save()
            Cuocs.map(async (cuoc) => {
                var vangnngu = cuoc.xu
                if (cuoc.type == x1) {
                    vangnngu += (cuoc.xu * setting.tile.cltx) - cuoc.xu
                }
                if (cuoc.type == x2) {
                    vangnngu += (cuoc.xu * setting.tile.cltx) - cuoc.xu
                }
                if (cuoc.type == x3) {
                    vangnngu += (cuoc.xu * setting.tile.cltx) - cuoc.xu
                }
                if (vangnngu > cuoc.xu) {
                    await UserControl.upMoney(cuoc.userId, vangnngu)
                    await UserControl.sodu(cuoc.userId, "Thắng game bầu cua", "+" + numberWithCommas(vangnngu))
                    await CuocBC.updateOne({ uid: new ObjectId(cuoc.userId), status: -1, _id: cuoc._id }, { type: cuoc.type, status: 1, x1: x1, x2: x2, x3: x3, vangnhan: vangnngu })
                    await new LichsuBaucua({ uid: cuoc.userId, status: 1, vangnhan: vangnngu, type: cuoc.type, vangdat: cuoc.xu, x1: x1, x2: x2, x3: x3 }).save()
                }
                else {
                    var user = await UserControl.upMoney(cuoc.userId, 0)
                    await UserControl.upHanmuc(cuoc.userId, -cuoc.xu, user.server)
                    await CuocBC.updateOne({ uid: new ObjectId(cuoc.userId), status: -1, _id: cuoc._id }, { status: 2, x1: x1, x2: x2, x3: x3, vangnhan: vangnngu })
                    await new LichsuBaucua({ uid: cuoc.userId, status: 2, vangnhan: vangnngu, x1: x1, x2: x2, x3: x3, type: cuoc.type, vangdat: cuoc.xu }).save()
                }
            })
            WinGame(x1, x2, x3, setting)
        }
        app.get("/baucua/getgame", async (req, res) => {
            try {
                const file = `./views/taixiu/baucua.ejs`;
                fs.readFile(file, async function (err, data) {

                    res.send(data);
                })
            } catch { res.send(""); }

        })
        app.get("/baucua/baotri", async (req, res) => {
            isBaotri = !isBaotri
            res.send(isBaotri)
        })



        app.get("/baucua/getcuoc", checklogin, async (req, res) => {
            var mycuoc = []
            var charcuoc = []
            if (req.user.isLogin) {
                mycuoc = await CuocBC.find({ status: -1, uid: req.user._id }, 'nhanvat time vangdat vangnhan status type').sort({ 'time': -1 })
                mycuoc.map(function (cuoc) {
                    cuoc.__v = 9999;
                })
                charcuoc = await CuocBC.find({}, 'nhanvat time vangdat vangnhan status type').sort({ 'time': -1 }).limit(20)
                mycuoc.map((item) => {
                    let index = charcuoc.findIndex(element => element._id.toString() === item._id.toString())
                    if (index > -1) {
                        charcuoc.splice(index, 1)
                    }
                })
                var cuoccccc = mycuoc.concat(charcuoc)
                return res.send(cuoccccc)
            }
            const gamess = await CuocBC.find({}, 'nhanvat time vangdat vangnhan status type').sort({ 'time': -1 }).limit(20)
            return res.send(gamess)
        })
        app.get("/baucua/gethis", async (req, res) => {
            const gamess = await GameBaucua.find({}, 'ketqua x1 x2 x3').sort({ $natural: -1 }).limit(13)
            res.send(gamess)
        })
        app.post("/baucua/putcuoc", cuocbaucualimit, checklogin, async (req, res) => {
            if (isBaotri) {
                return res.send({ error: 1, message: "Bảo trì trong giây lát" })
            }
            var vangcuoc = req.body.vangcuoc
            var type = req.body.type
            if (req.session.time) {
                if (timeSince(req.session.time) < 2) {
                    return res.send({ error: 1, message: "Thao tác quá nhanh" })
                }
            }
            req.session.time = Date.now()
            const gold2 = Number(vangcuoc.replace(/[^0-9 ]/g, ""))

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
                else if (type != 1 && type != 2 && type != 3 && type != 4 && type != 5 && type != 6) {
                    return res.send({ error: 1, message: "Vui lòng chọn lại" });
                }
                else if (gold2 < 3000000) {
                    return res.send({ error: 1, message: "Chỉ được đặt trên 3tr" });
                }
                else if (user.vang < gold2) {
                    return res.send({ error: 1, message: "Bạn không đủ vàng để đặt" });
                }
                if (Game.Time < 5) {
                    return res.send({ error: 1, message: "Vui lòng đặt trước 5 giây" });
                }
                var check = await UserControl.upMoney(user._id, -gold2)
                const uphanmuc = await UserControl.upHanmuc(user._id, gold2, req.user.server)

                if (check) {




                    var checklastcuoc = await CuocBC.findOne({ type: type, status: -1, uid: new ObjectId(user._id) })

                    var savecuoc = null;
                    if (!checklastcuoc) {

                        const addCuoc = new CuocBC({ vangdat: gold2, uid: user._id, nhanvat: user.tenhienthi, type: type })

                        try {
                            const savedCuoc = await addCuoc.save()
                            savecuoc = savedCuoc
                            if (type == 1) {
                                Game.Vangx1 += gold2
                            }
                            else if (type == 2) { Game.Vangx2 += gold2 }
                            else if (type == 3) { Game.Vangx3 += gold2 }
                            else if (type == 4) { Game.Vangx4 += gold2 }
                            else if (type == 5) { Game.Vangx5 += gold2 }
                            else if (type == 6) { Game.Vangx6 += gold2 }
                            AddCuocs(user._id, type, gold2, savecuoc._id)
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }
                    else {
                        await CuocBC.findByIdAndUpdate({ _id: checklastcuoc._id }, { $inc: { vangdat: gold2 } })
                        if (type == 1) {
                            Game.Vangx1 += gold2
                        }
                        else if (type == 2) { Game.Vangx2 += gold2 }
                        else if (type == 3) { Game.Vangx3 += gold2 }
                        else if (type == 4) { Game.Vangx4 += gold2 }
                        else if (type == 5) { Game.Vangx5 += gold2 }
                        else if (type == 6) { Game.Vangx6 += gold2 }
                        AddCuocs(user._id, type, gold2, checklastcuoc._id)
                    }

                    var chonkqqq = "";
                    const sodu = await UserControl.sodu(user._id, "Cược game bầu cua", "-" + numberWithCommas(gold2))



                    return res.send({ error: 0, message: "Đặt cược thành công" });
                }
            }
        })
        app.get("/baucua/putcuoc", (req, res) => {
            console.log("cc")
        })


        function AddCuocs(userId, type, xu, _id) {
            if (Cuocs.some(cuoc => cuoc.userId.toString() === userId.toString() && cuoc.type === type)) {
                updateCuoc(userId.toString(), type, xu)
            }
            else {
                Cuocs.push({
                    userId: userId.toString(),
                    type: type,
                    xu: xu,
                    _id: _id
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


        function WinGame(x1, x2, x3, setting) {
            setTimeout(() => {

                for (var i = 0; i < Cuocs.length; i++) {
                    var cuoc = Cuocs[i];
                    //  try {
                    var vangnngu = cuoc.xu
                    if (cuoc.type == x1) {
                        vangnngu += (cuoc.xu * setting.tile.cltx) - cuoc.xu
                    }
                    if (cuoc.type == x2) {
                        vangnngu += (cuoc.xu * setting.tile.cltx) - cuoc.xu
                    }
                    if (cuoc.type == x3) {
                        vangnngu += (cuoc.xu * setting.tile.cltx) - cuoc.xu
                    }
                    try {
                        var socket = PlayerSocket.SocketPlayer.find(player => player.userId.toString() === cuoc.userId.toString()).socket;

                        if (vangnngu > cuoc.xu) {

                            io.to(socket).emit('traothuongbc', { status: "win", message: "+" + numberWithCommas(vangnngu) });
                        }
                        else {
                            io.to(socket).emit('traothuongbc', { status: "thua", message: "-" + numberWithCommas(cuoc.xu) });
                        }
                    } catch { }
                }
            }, Game.TimeWait * 1000)
        }

        function formatNumber(number) {
            var text = "";
            var text2 = "";
            if (number >= 1000000000) {
                text2 = " tỷ";
                var num = (number % (1000000000 / 100000000));
                number = (number / 1000000000);
                number = Math.round(number * 1000) / 1000
                text = number;
                text += text2;
            }
            else {
                text = numberWithCommas(Math.round(number));
            }
            return text;
        }


        var Game = {
            Vangx1: 0,
            Vangx2: 0,
            Vangx3: 0,
            Vangx4: 0,
            Vangx5: 0,
            Vangx6: 0,
            UserTai: 0,
            UserXiu: 0,
            Time: 0,
            TimeWait: 0,
            Status: "start",
            x1: -1,
            x2: -1,
            x3: -1
        }
        function GameStart() {
            Game.Vangx1 = 0,
                Game.Vangx2 = 0,
                Game.Vangx3 = 0,
                Game.Vangx4 = 0,
                Game.Vangx5 = 0,
                Game.Vangx6 = 0,
                Game.Time = 35,
                Game.TimeWait = 15,
                Game.Status = "running",
                Game.x1 = -1,
                Game.x2 = -1,
                Game.x3 = -1,
                Cuocs = []
        }

        setInterval(() => {
            if (Game.Status === "start") {

                GameStart()

            }
            else if (Game.Status == "running") {

                try {
                    io.sockets.emit("runningbc", { time: Game.Time, vangx1: formatNumber(Game.Vangx1), vangx2: formatNumber(Game.Vangx2), vangx3: formatNumber(Game.Vangx3), vangx4: formatNumber(Game.Vangx4), vangx5: formatNumber(Game.Vangx5), vangx6: formatNumber(Game.Vangx6) });
                } catch { }
                Game.Time--
                if (Game.Time <= -1) {
                    Game.x1 == -1 ? (Game.x1 = (Math.floor(Math.random() * 6) + 1)) : (Game.x1 = Game.x1)
                    Game.x2 == -1 ? (Game.x2 = (Math.floor(Math.random() * 6) + 1)) : (Game.x2 = Game.x2)
                    Game.x3 == -1 ? (Game.x3 = (Math.floor(Math.random() * 6) + 1)) : (Game.x3 = Game.x3)

                    try {
                        io.sockets.emit("ketquabc", { time: Game.Time, vangx1: formatNumber(Game.Vangx1), vangx2: formatNumber(Game.Vangx2), vangx3: formatNumber(Game.Vangx3), vangx4: formatNumber(Game.Vangx4), vangx5: formatNumber(Game.Vangx5), vangx6: formatNumber(Game.Vangx6), ketqua: { x1: Game.x1, x2: Game.x2, x3: Game.x3 } });
                    } catch { }
                    TraoThuong(Game.x1, Game.x2, Game.x3)
                    Game.Status = "waitgame"
                }
            }
            else if (Game.Status == "waitgame") {
                try {
                    io.sockets.emit("waitgamebc", { time: Game.TimeWait, vangx1: formatNumber(Game.Vangx1), vangx2: formatNumber(Game.Vangx2), vangx3: formatNumber(Game.Vangx3), vangx4: formatNumber(Game.Vangx4), vangx5: formatNumber(Game.Vangx5), vangx6: formatNumber(Game.Vangx6), ketqua: { x1: Game.x1, x2: Game.x2, x3: Game.x3 } });
                } catch { }
                Game.TimeWait--
                if (Game.TimeWait <= -1) {
                    Game.Status = "start"
                }

            }
        }, 1000)
    }
}
module.exports = new GameBauCua