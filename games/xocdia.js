
const CuocXD = require("../models/xocdia/Cuoc")
const GameXD = require("../models/xocdia/Game")
// const LichsuXD = require("../models/xocdia/Lichsu")
const Setting = require("../models/Setting")
const User = require("../models/User")
const checklogin = require("../Middleware/checklogin")
const UserControl = require("../controller/user")
const { v4: uuidv4 } = require('uuid');

const PlayerSocket = require('./PlayerSocket')
const redisClient = require("../redisCache")
const keyHisXocDia = "xocdiahis"
class GameXocDia {

    xocdia = (io, app) => {
        let isBaotri = false;
        let addHisToRedis = async (his) => {
            let cuocGlobal = await redisClient.get(keyHisXocDia)
            if (!cuocGlobal) {
                await redisClient.set(keyHisXocDia, JSON.stringify([his]))
            }
            else {
                let cuocsJ = JSON.parse(cuocGlobal)
                cuocsJ.unshift(his)
                if (cuocsJ.length > 200) {
                    cuocsJ.pop();
                }
                await redisClient.set(keyHisXocDia, JSON.stringify(cuocsJ))
            }
        }
        let updateCuocRedis = async (his) => {
            const cuocs = await redisClient.get(keyHisXocDia)
            if (cuocs) {
                let cuocsJ = JSON.parse(cuocs)
                let index = cuocsJ.findIndex(x => x.id.toString() == his.id.toString())
                if (index != -1) {
                    cuocsJ[index] = his
                }
                await redisClient.set(keyHisXocDia, JSON.stringify(cuocsJ))
            }
        }


        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        app.get("/xocdia/baotri", async (req, res) => {
            isBaotri = !isBaotri
            res.send(isBaotri)
        })


        app.get("/xocdia/getHis", async (req, res) => {
            let cuocGlobal = await redisClient.get(keyHisXocDia)
            if (!cuocGlobal) {
                res.send([])
            }
            else {
                let cuocsJ = JSON.parse(cuocGlobal)
                res.send(cuocsJ)
            }
        })
        let getChanle = (type) => {
            if (type == "chan" || type.includes("chan")) {
                return "c"
            }
            return "l"
        }
        app.get("/xocdia/soicau", async (req, res) => {
            res.send(soiCaus)
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
            let check = await UserControl.upMoney(user._id, -gold)
            if (check) {
                await AddCuocs(user._id, type, gold, user)
                await UserControl.sodu(user._id.toString(), "Cược game xóc đĩa", "-" + numberWithCommas(gold))


                return res.send({ error: 0, message: "Đặt cược thành công" });
            }
            else {
                return res.send({ error: q, message: "Đặt cược thất bại" });
            }
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
        async function AddCuocs(userId, type, xu, user) {

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
                let id = uuidv4()
                let cuocRedis = {
                    id,
                    username: user.tenhienthi,
                    vangdat: xu,
                    cuadat: type,
                    status: -1,
                    vangthang: -1,
                    time: Date.now()
                }
                Game.Cuocs.push({
                    id,
                    userId: userId.toString(),
                    type: type,
                    xu: xu,
                    username: user.tenhienthi,
                    cuocRedis
                })
                await addHisToRedis(cuocRedis)
            }
        }
        function updateCuoc(userId, type, xu) {
            for (let cuoc of Game.Cuocs) {
                if (cuoc.userId.toString() == userId.toString() && cuoc.type == type) {
                    cuoc.xu += xu;
                    cuoc.cuocRedis.vangdat = cuoc.xu;
                    updateCuocRedis(cuoc.cuocRedis)
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
            CuocUsers: {},
            ketqua: ""

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

            Game.Time = 20
            Game.TimeWait = 15
            Game.Cuocs = []
            Game.CuocUsers = {}
            Game.x1 = -1
            Game.x2 = -1
            Game.x3 = -1
            Game.x4 = -1
            Game.ketqua = ""
            Game.Status = "running"
        }
        let getSoiCau = async () => {
            let games = await GameXD.find({}).sort({ _id: -1 }).limit(70)
            let array = games.reverse()
            let table = [[], [], [], [], []]
            let x = 0
            let y = 0
            for (let i = 0; i < array.length; i++) {
                let gettype = getChanle(array[i].ketqua)
                if (y == 5) {
                    y = 0;
                    x++
                }
                table[y][x] = gettype
                y++
                if (array[i + 1] && getChanle(array[i + 1].ketqua) != gettype || array.length - 1 == i) {
                    while (y < table.length) {
                        table[y][x] = " "
                        y++
                    }
                    x++
                    y = 0
                }
            }
            while (x > 18) {
                table[0].shift()
                table[1].shift()
                table[2].shift()
                table[3].shift()
                table[4].shift()
                x--
            }
            return table
        }

        let soiCaus = [[], [], [], [], []]

        let updateSoiCauData = async () => {
            let caus = await getSoiCau()
            soiCaus = caus
        }
        updateSoiCauData()

        let TraoThuong = async (ketqua) => {
            let phienXd = await new GameXD({ x1: Game.x1, x2: Game.x2, x3: Game.x3, x4: Game.x4, ketqua: Game.ketqua, status: 1 }).save()
            let arrPlayer = []
            for (let cuoc of Game.Cuocs) {
                let tienWin = 0
                if ((cuoc.type == "chan" && ketqua.includes("chan")) || (cuoc.type == "le" && ketqua.includes("le"))) {
                    tienWin = cuoc.xu * 1.98
                }
                else if ((cuoc.type == "chan4do" && ketqua == cuoc.type) || (cuoc.type == "chan4den" && ketqua == cuoc.type)) {
                    tienWin = cuoc.xu * 15
                }
                else if ((cuoc.type == "le3den" && ketqua == cuoc.type) || (cuoc.type == "le3do" && ketqua == cuoc.type)) {
                    tienWin = cuoc.xu * 3
                }
                else {
                    tienWin = -cuoc.xu
                }
                if (tienWin > 0) {
                    let user = await UserControl.upMoney(cuoc.userId, tienWin)
                    await UserControl.upHanmuc(cuoc.userId, cuoc.xu, user.server)
                    await UserControl.upThanhtich(cuoc.userId, cuoc.xu)
                    await UserControl.sodu(cuoc.userId, "Thắng game xóc đĩa", "+" + numberWithCommas(tienWin))
                }

                await new CuocXD({
                    phien: phienXd._id, x1: Game.x1, x2: Game.x2, x3: Game.x3, x4: Game.x4, vangdat: cuoc.xu, vangnhan: tienWin, uid: cuoc.userId, nhanvat: cuoc.username, type: cuoc.type,
                    status: (tienWin >= 0 ? 1 : 2)
                }).save()
                arrPlayer.push({ tienWin, userId: cuoc.userId })
                if (tienWin > 0) {
                    cuoc.cuocRedis.vangthang = tienWin
                    cuoc.cuocRedis.status = 1
                }
                else {
                    cuoc.cuocRedis.vangthang = 0
                    cuoc.cuocRedis.status = 2
                }
                await updateCuocRedis(cuoc.cuocRedis)
            }
            await updateSoiCauData()
            return arrPlayer
        }

        setInterval(async () => {
            let dataSend = {
                time: Game.Time,
                timeWait: Game.TimeWait,
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
            if (Game.Status == "start") {
                GameStart()
            }
            else if (Game.Status == "running") {
                for (let p of PlayerSocket.SocketPlayer) {
                    io.to(p.socket).emit('cuoc-xd-user', getCuocUser(p.userId));
                }
                io.sockets.emit("running-xocdia", dataSend);
                Game.Time--
                if (Game.Time <= -1) {
                    Game.x1 = Math.floor(Math.random() * 2) + 1
                    Game.x2 = Math.floor(Math.random() * 2) + 1
                    Game.x3 = Math.floor(Math.random() * 2) + 1
                    Game.x4 = Math.floor(Math.random() * 2) + 1

                    let ketquas = { "1": 0, "2": 0 }
                    ketquas[Game.x1]++
                    ketquas[Game.x2]++
                    ketquas[Game.x3]++
                    ketquas[Game.x4]++
                    if (ketquas["1"] == 2 && ketquas["2"] == 2) {
                        Game.ketqua = "chan"
                    }
                    if (ketquas["1"] == 1 && ketquas["2"] == 3) {
                        Game.ketqua = "le3den"
                    }
                    if (ketquas["1"] == 3 && ketquas["2"] == 1) {
                        Game.ketqua = "le3do"
                    }
                    if (ketquas["1"] == 4) {
                        Game.ketqua = "chan4do"
                    }
                    if (ketquas["2"] == 4) {
                        Game.ketqua = "chan4den"
                    }
                    io.sockets.emit("ketqua-xd", { data: dataSend, ketqua: { x1: Game.x1, x2: Game.x2, x3: Game.x3, x4: Game.x4 }, ketqua2: Game.ketqua });
                    Game.Status = "waitgame"
                    let winners = await TraoThuong(Game.ketqua)
                    const result = Object.values(winners.reduce((cuoc, { tienWin, userId }) =>
                        ((cuoc[userId] = cuoc[userId] || { userId, tienWin: 0 }).tienWin += tienWin, cuoc), {}));

                    setTimeout(() => {
                        for (let cuoc of result) {
                            try {
                                let socket = PlayerSocket.SocketPlayer.find(player => player.userId.toString() === cuoc.userId.toString());
                                io.to(socket.socket).emit('traothuong-xd', { status: (cuoc.tienWin > 0 ? "win" : "thua"), message: (cuoc.tienWin > 0 ? "+" : "") + numberWithCommas(cuoc.tienWin) });
                            } catch { }
                        }
                    }, (Game.TimeWait * 1000) - 2000);
                }
            }
            else if (Game.Status == "waitgame") {
                io.sockets.emit("waitgame-xd", { data: dataSend, ketqua: { x1: Game.x1, x2: Game.x2, x3: Game.x3, x4: Game.x4 }, ketqua2: Game.ketqua });
                Game.TimeWait--
                if (Game.TimeWait <= -1) {
                    Game.Status = "start"
                }
            }
        }, 1000)
    }
}
module.exports = new GameXocDia