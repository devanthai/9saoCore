
const CuocXD = require("../models/xocdia/Cuoc")
const GameXD = require("../models/xocdia/Game")
// const LichsuXD = require("../models/xocdia/Lichsu")
const Setting = require("../models/Setting")
const User = require("../models/User")
const checklogin = require("../Middleware/checklogin")

const PlayerSocket = require('./PlayerSocket')
const redisClient = require("../redisCache")

class GameXocDia {
    xocdia = (io, app) => {
        let isBaotri = false;

        app.get("/xocdia/baotri", async (req, res) => {
            isBaotri = !isBaotri
            res.send(isBaotri)
        })

        app.post("/xocdia/putcuoc", checklogin, async (req, res) => {
            if (isBaotri) {
                return res.send({ error: 1, message: "Bảo trì trong giây lát" })
            }
            let { vangcuoc, type } = req.body
            console.log(type)
            const gold = Number(vangcuoc.replace(/,/g, ''))
            if (!req.user.isLogin) {
                return res.send({ error: 1, message: "Vui lòng đăng nhập" });
            }
            if (Game.Time < 1) {
                return res.send({ error: 1, message: "Hết thời gian đặt cược" });
            }
            const user = await User.findOne({ _id: req.session.userId })
            if (!user) {
                return res.send({ error: 1, message: "Không tìm thấy user này vui lòng đăng nhập lại" });
            }
            if (vangcuoc === "" || type === "") {
                return res.send({ error: 1, message: "Lỗi" });
            }

            if (isNaN(gold)) {
                return res.send({ error: 1, message: "Lỗi vàng cược" });
            }

            if (type != "chan" && type != "le" && type != "chan4do" && type != "chan4den" && type != "le3den" && type != "le3do") {
                return res.send({ error: 1, message: "Vui lòng chọn lại" });
            }

            if (gold < 3000000) {
                return res.send({ error: 1, message: "Chỉ được đặt trên 3 triệu vàng" });
            }

            if (user.vang < gold) {
                return res.send({ error: 1, message: "Bạn không đủ vàng để đặt cược" });
            }

            AddCuocs(user._id, type, gold, user)

            return res.send({ error: 0, message: "Đặt cược thành công" });


        })

        function getCuocUser(userId) {
            return Game.CuocUsers[userId] ? {
                chan: Game.CuocUsers[userId].chan,
                le: Game.CuocUsers[userId].le,
                chan4do: Game.CuocUsers[userId].chan4do,
                chan4den: Game.CuocUsers[userId].chan4den,
                le3den: Game.CuocUsers[userId].le3den,
                le3do: Game.CuocUsers[userId].le3do,
            } : {
                chan: 0,
                le: 0,
                chan4do: 0,
                chan4den: 0,
                le3den: 0,
                le3do: 0,
            }
        }
        function AddCuocs(userId, type, xu, user) {

            if (!Game.CuocUsers[userId]) {
                Game.CuocUsers[userId] = { chan: 0, le: 0, chan4do: 0, chan4den: 0, le3den: 0, le3do: 0 }
            }
            if (type == "chan") {
                Game.CuocUsers[userId].chan += xu
            }
            else if (type == "le") {
                Game.CuocUsers[userId].le += xu
            }
            else if (type == "chan4do") {
                Game.CuocUsers[userId].chan4do += xu
            }
            else if (type == "chan4den") {
                Game.CuocUsers[userId].chan4den += xu
            }
            else if (type == "le3den") {
                Game.CuocUsers[userId].le3den += xu
            }
            else if (type == "le3do") {
                Game.CuocUsers[userId].le3do += xu
            }


            if (type == "chan") {
                Game.vangChan += xu
            }
            else if (type == "le") {
                Game.vangLe += xu
            }
            else if (type == "chan4do") {
                Game.vang4do += xu
            }
            else if (type == "chan4den") {
                Game.vang4den += xu
            }
            else if (type == "le3den") {
                Game.vang3den += xu
            }
            else if (type == "le3do") {
                Game.vang3do += xu
            }


            if (Game.Cuocs.some(cuoc => cuoc.userId.toString() === userId.toString() && cuoc.type === type)) {
                updateCuoc(userId.toString(), type, xu)
            }
            else {
                if (type == "chan") {
                    Game.countPlayerChan += 1
                }
                else if (type == "le") {
                    Game.countPlayerLe += 1
                }
                else if (type == "chan4do") {
                    Game.countPlayer4do += 1
                }
                else if (type == "chan4den") {
                    Game.countPlayer4den += 1
                }
                else if (type == "le3den") {
                    Game.countPlayer3den += 1
                }
                else if (type == "le3do") {
                    Game.countPlayer3do += 1
                }

                Game.Cuocs.push({
                    userId: userId.toString(),
                    type: type,
                    xu: xu,
                    username: user.tenhienthi
                })
            }


        }
        function updateCuoc(userId, type, xu) {
            for (let cuoc of Game.Cuocs) {
                if (cuoc.userId.toString() == userId.toString() && cuoc.type == type) {
                    cuoc.xu += xu;
                    break;
                }
            }
        }


        let Game = {
            vangChan: 0,
            countPlayerChan: 0,

            vangLe: 0,
            countPlayerLe: 0,

            vang4do: 0,
            countPlayer4do: 0,

            vang4den: 0,
            countPlayer4den: 0,

            vang3den: 0,
            countPlayer3den: 0,

            vang3do: 0,
            countPlayer3do: 0,

            TimeWait: 0,
            Time: 0,
            Status: "start",
            x1: -1,
            x2: -1,
            x3: -1,
            x4: -1,
            Cuocs: [],
            CuocUsers: {}

        }
        function GameStart() {

            Game.vangChan = 0
            Game.countPlayerChan = 0

            Game.vangLe = 0
            Game.countPlayerLe = 0

            Game.vang4do = 0
            Game.countPlayer4do = 0

            Game.vang4den = 0
            Game.countPlayer4den = 0

            Game.vang3den = 0
            Game.countPlayer3den = 0

            Game.vang3do = 0
            Game.countPlayer3do = 0

            Game.Time = 30
            Game.TimeWait = 10
            Game.Cuocs = []
            Game.CuocUsers = {}
            Game.x1 = -1
            Game.x2 = -1
            Game.x3 = -1
            Game.x4 = -1

            Game.Status = "running"

        }
        setInterval(() => {
            if (Game.Status == "start") {
                GameStart()
            }
            else if (Game.Status == "running") {

                for (let p of PlayerSocket.SocketPlayer) {
                    io.to(p.socket).emit('cuoc-xd-user', getCuocUser(p.userId));
                }

                io.sockets.emit("running-xocdia",
                    {
                        time: Game.Time,
                        vangChan: Game.vangChan,
                        countPlayerChan: Game.countPlayerChan,

                        vangLe: Game.vangLe,
                        countPlayerLe: Game.countPlayerLe,

                        vang4do: Game.vang4do,
                        countPlayer4do: Game.countPlayer4do,

                        vang4den: Game.vang4den,
                        countPlayer4den: Game.countPlayer4den,

                        vang3den: Game.vang3den,
                        countPlayer3den: Game.countPlayer3den,

                        vang3do: Game.vang3do,
                        countPlayer3do: Game.countPlayer3do,
                    }
                );

                Game.Time--
                if (Game.Time <= -1) {
                    Game.x1 = Math.floor(Math.random() * 2) + 1
                    Game.x2 = Math.floor(Math.random() * 2) + 1
                    Game.x3 = Math.floor(Math.random() * 2) + 1
                    Game.x4 = Math.floor(Math.random() * 2) + 1

                    Game.Status = "waitgame"
                }
            }
            else if (Game.Status == "waitgame") {
                try {
                    io.sockets.emit("waitgame-xd", { time: Game.TimeWait });
                } catch { }
                Game.TimeWait--
                if (Game.TimeWait <= -1) {
                    Game.Status = "start"
                }
            }
        }, 1000)
    }
}

module.exports = new GameXocDia