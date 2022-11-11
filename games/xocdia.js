
const CuocXD = require("../models/xocdia/Cuoc")
const GameXD = require("../models/xocdia/Game")
const LichsuXD = require("../models/xocdia/Lichsu")
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

            if (type != "chan" && type != "le" && type != "chan4do" && type != "le4do" && type != "le3den" && type != "le3do") {
                return res.send({ error: 1, message: "Vui lòng chọn lại" });
            }

            if (gold < 3000000) {
                return res.send({ error: 1, message: "Chỉ được đặt trên 3 triệu vàng" });
            }

            if (user.vang < gold) {
                return res.send({ error: 1, message: "Bạn không đủ vàng để đặt cược" });
            }



        })

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
            Cuocs: []

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
                // for (let i = 0; i < PlayerSocket.SocketPlayer.length; i++) {

                // }
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