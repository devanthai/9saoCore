
const CuocXD = require("../models/xocdia/Cuoc")
const GameXD = require("../models/xocdia/Game")
const LichsuXD = require("../models/xocdia/Lichsu")
const Setting = require("../models/Setting")
const User = require("../models/User")
const checklogin = require("../Middleware/checklogin")

const PlayerSocket = require('./PlayerSocket')

class GameXocDia {
    xocdia = (io, app) => {
        let Game = {
            vangChan: 0,
            vangLe: 0,
            vang4do: 0,
            vang4den: 0,
            vang3den: 0,
            vang3do: 0,
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
        }
        setInterval(() => {
            if (Game.Status == "start") {
                GameStart()
            }
            else if (Game.Status == "running") {
                for (let i = 0; i < PlayerSocket.SocketPlayer.length; i++) {

                }
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