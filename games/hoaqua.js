const Hu = require("../models/hoaqua/Hu")
const User = require("../models/User")
const fs = require('fs');


//top thắng
const keyTopSpinHoaQua = "TopSpinHoaQua"

//lịch sử quay: lấy key+uid là ra
const keyHisSpinHoaqua = "hisSpinHoaQua"

//lịch sử trúng hũ
const keyHistrunghuHoaqua = "hisTrunghuHoaQua"

const keyWaitHoaqua = "keyWaitHoaqua"


const redis = require('redis')
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    redisClient.connect()
    console.log("Error " + err)
});
redisClient.connect()


class HoaQua {

    game = (io) => {
        function sendMess(client, mess) {
            client.emit("message-hoaqua", mess)
        }
        function getMoneyBetByValue(value) {
            if (value == 1) {
                return 1000000
            }
            else if (value == 2) {
                return 5000000
            }
            else if (value == 3) {
                return 50000000
            }
            else if (value == 4) {
                return 100000000
            }
            else {
                return 0
            }
        }
        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }
        function addTop(user, vangwin) {
            redisClient.publish("addTopHoaQua", JSON.stringify({ username: user.tenhienthi, vangwin }))
        }
        function addHis(data) {
            redisClient.publish("addHisHoaQua", JSON.stringify(data))
        }
        function addHisTrungHu(data) {
            redisClient.publish("addHisTrungHuHoaQua", JSON.stringify(data))
        }
        let rawdata = fs.readFileSync('./config/hoaqua.json');
        let listPTCCC = JSON.parse(rawdata);
        let listHoaquas = listPTCCC
        let isBaoTri = false


        function getResultHoaQua(listQuas, tiencuoc) {
            let tienThang = 0
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (listQuas[0].type == 2) {
                listQuas[0] = listQuas[1]
            }

            if (listQuas[1].type == 2) {
                listQuas[1] = listQuas[0]
            }

            if (listQuas[2].type == 2) {
                listQuas[2] = listQuas[1]
            }

            //x - wild - wild
            if (listQuas[1].type == 2 && listQuas[2].type == 2) {
                listQuas[1] = listQuas[0]
                listQuas[2] = listQuas[0]
            }

            //will - x - wild
            if (listQuas[0].type == 2 && listQuas[2].type == 2) {
                listQuas[0] = listQuas[1]
                listQuas[2] = listQuas[1]
            }

            //will - wild - x
            if (listQuas[0].type == 2 && listQuas[1].type == 2) {
                listQuas[0] = listQuas[2]
                listQuas[1] = listQuas[2]
            }
            // 3 cái số 7
            if (listQuas[0].type == 3 && listQuas[1].type == 3 && listQuas[2].type == 3) {
                tienThang = tiencuoc * 95
            }

            // 3 cái chuông
            if (listQuas[0].type == 1 && listQuas[1].type == 1 && listQuas[2].type == 1) {
                tienThang = tiencuoc * 50
            }

            // 3 cái dưa hấu
            if (listQuas[0].type == 6 && listQuas[1].type == 6 && listQuas[2].type == 6) {
                tienThang = tiencuoc * 22
            }

            // 2 cái cherry
            if (listQuas[0].type == 5 && listQuas[1].type == 5) {
                tienThang = tiencuoc * 3
            }

            // 3 cái cherry
            if (listQuas[0].type == 5 && listQuas[1].type == 5 && listQuas[2].type == 5) {
                tienThang = tiencuoc * 6
            }

            // 2 cái cam
            if (listQuas[0].type == 4 && listQuas[1].type == 4) {
                tienThang = tiencuoc * 2
            }

            // 3 cái cam
            if (listQuas[0].type == 4 && listQuas[1].type == 4 && listQuas[2].type == 4) {
                tienThang = tiencuoc * 4
            }

            // 2 cái chanh
            if (listQuas[0].type == 7 && listQuas[1].type == 7) {
                tienThang = tiencuoc * 2
            }

            // 3 cái chanh
            if (listQuas[0].type == 7 && listQuas[1].type == 7 && listQuas[2].type == 7) {
                tienThang = tiencuoc * 3
            }
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            return tienThang
        }


        io.on("connection", client => {
            client.on('connect_failed', function () {
                console.log("Sorry, there seems to be an issue with the connection!");
            })
            client.on('connect_error', function () {
                console.log("Sorry, there seems to be an issue with the connection!");
            })
            client.on("hoaqua/baotri", async (data) => {
                isBaoTri = !isBaoTri
                sendMess(client, { error: 0, message: "ok " + isBaoTri })
            })
            client.on('hoaqua/changeTile/9sao', (data) => {
                if (data == "json") {
                    let rawdata = fs.readFileSync('./config/hoaqua.json');
                    let listPTCCC = JSON.parse(rawdata);
                    listHoaquas = listPTCCC
                    console.log(listHoaquas)
                }
            })

            client.on("hoaqua/getHis", async (data) => {
                if (isBaoTri) {
                    client.emit("hoaqua/bet", { error: true, message: "Đang bảo trì vui lòng quay lại sau" })
                }
                else if (!client.request.session.userId) {
                    sendMess(client, { error: true, message: "Vui lòng đăng nhập" })
                }
                else {
                    let hisdata = await redisClient.get(keyHisSpinHoaqua + client.request.session.userId.toString())
                    hisdata = hisdata ? JSON.parse(hisdata) : []
                    client.emit("hoaqua/gethis", hisdata.slice(0, 1000))
                }
            })
            client.on("hoaqua/getTop", async (data) => {
                if (isBaoTri) {
                    client.emit("hoaqua/bet", { error: true, message: "Đang bảo trì vui lòng quay lại sau" })
                }
                else {
                    let topdata = await redisClient.get(keyTopSpinHoaQua)
                    topdata = topdata ? JSON.parse(topdata) : []
                    client.emit("hoaqua/getTop", topdata.slice(0, 20))
                }
            })
            client.on("hoaqua/getNoHu", async (data) => {
                if (isBaoTri) {
                    client.emit("hoaqua/bet", { error: true, message: "Đang bảo trì vui lòng quay lại sau" })
                }
                else {
                    let hudata = await redisClient.get(keyHistrunghuHoaqua)
                    hudata = hudata ? JSON.parse(hudata) : []
                    client.emit("hoaqua/getNoHu", hudata)
                }
            })

            client.on('hoaqua/changeMucBet', muccuoc => {
                console.log(muccuoc)
                if (muccuoc != 1 && muccuoc != 2 && muccuoc != 3 && muccuoc != 4) {
                    sendMess(client, { error: true, message: "Tha em" })
                }
                else {
                    Hu.findOne({ muccuoc: muccuoc, isBum: false }, '', (err, data) => {
                        if (!data) {
                            let vanghuCreate = 0
                            if (muccuoc == 1) {
                                vanghuCreate = 1000000000
                            } else if (muccuoc == 2) {
                                vanghuCreate = 5000000000
                            }
                            else if (muccuoc == 3) {
                                vanghuCreate = 10000000000
                            }
                            else if (muccuoc == 4) {
                                vanghuCreate = 20000000000
                            }
                            Hu.create({ vanghu: vanghuCreate, muccuoc: muccuoc }, function (err, hu) {
                                if (err) {
                                    sendMess(client, { error: true, message: "Loi" })
                                }
                                else {
                                    client.emit("hoaqua/changeMucBet", hu)
                                }
                            });
                        }
                        else {
                            client.emit("hoaqua/changeMucBet", data)
                        }
                    })
                }
            })
            client.on("hoaqua/bet", async (data) => {
                const { muc } = data
                const tiencuoc = getMoneyBetByValue(muc)
                if (tiencuoc <= 0) {
                    return sendMess(client, { error: true, message: "Lỗi" })
                }
                if (!client.request.session.userId) {
                    return client.emit("hoaqua/bet", { error: true, message: "Vui lòng đăng nhập" })
                }
                const dateNow = Date.now()
                const keyWaituser = keyWaitHoaqua + client.request.session.userId
                const getRedis = await redisClient.get(keyWaituser)
                if (getRedis) {
                    if (dateNow - getRedis < 1000) {
                        return client.emit("hoaqua/bet", { error: true, message: "Quá nhanh quá nguy hiểm vui lòng chậm lại" })
                    }
                }
                await redisClient.set(keyWaituser, dateNow)


                let user = await User.findOne({ _id: client.request.session.userId })
                if (!user) {
                    return client.emit("hoaqua/bet", { error: true, message: "Vui lòng đăng nhập" })
                }

                if (user.vang <= 2000000) {
                    return client.emit("hoaqua/bet", { error: true, message: "Yêu cầu số dư trên 2tr vàng" })
                }
                if (user.vang < tiencuoc) {
                    return client.emit("hoaqua/bet", { error: true, message: "Bạn Không đủ vàng để quay" })
                }


                let vanghu = 0

                let huuuu = await Hu.findOne({ muccuoc: muc, isBum: false })
                vanghu = huuuu ? huuuu.vanghu : 0

                if (huuuu) {
                    vanghu = huuuu.vanghu
                }
                else {
                    let vanghuCreate = 0
                    if (muc == 1) {
                        vanghuCreate = 1000000000
                    } else if (muc == 2) {
                        vanghuCreate = 5000000000
                    }
                    else if (muc == 3) {
                        vanghuCreate = 20000000000
                    }
                    else if (muc == 4) {
                        vanghuCreate = 50000000000
                    }

                    huuuu = await new Hu({ vanghu: vanghuCreate, muccuoc: muc }).save()

                    vanghu = huuuu ? huuuu.vanghu : 0;


                }

                const beforeBet = user.vang
                let afterBet = user.vang

                user.vang -= tiencuoc
                afterBet = user.vang
                user.save()


                const expanded = listHoaquas.quas.flatMap(giai => Array(giai.pct).fill(giai));

                let qua1 = expanded[Math.floor(Math.random() * expanded.length)]
                let qua2 = expanded[Math.floor(Math.random() * expanded.length)]
                let qua3 = expanded[Math.floor(Math.random() * expanded.length)]

                let listQuas = [qua1, qua2, qua3]

                //
                // qua1 = listHoaquas.quas[0]
                // qua2 = listHoaquas.quas[0]
                // qua3 = listHoaquas.quas[0]
                // listQuas = [qua1, qua2, qua3]

                let tienThang = getResultHoaQua(listQuas, tiencuoc)

                if (tienThang > 0) {
                    const randomz = Math.floor(Math.random() * listHoaquas.tile.maxRan)
                    let isZ = randomz % listHoaquas.tile.chia == 0
                    console.log("RANDOMMMMM " + randomz,isZ)
                    if (!isZ) {
                        qua2 = expanded[Math.floor(Math.random() * expanded.length)];
                        listQuas = [qua1, qua2, qua3]
                        tienThang = getResultHoaQua(listQuas, tiencuoc)
                    }
                }

                let countWild = 0
                if (qua1.type == 2) countWild++
                if (qua2.type == 2) countWild++
                if (qua3.type == 2) countWild++


                let isWild = false
                if (countWild > 0) {
                    isWild = true
                }

                let xWild = Math.floor(Math.random() * 3) + 1
                let arrXwild = []
                arrXwild.push(xWild)

                for (let i = 0; i < countWild - 1; i++) {
                    let xwilddd = Math.floor(Math.random() * 3) + 1
                    xWild *= xwilddd
                    arrXwild.push(xwilddd)
                }
                let isNohu = false
                if (countWild == 3) //nohu
                {
                    tienThang = Math.round((vanghu * xWild) / 27)
                    huuuu.isBum = true
                    huuuu.winner = user.tenhienthi
                    huuuu.save()
                    isNohu = true
                }
                if (isWild && tienThang > 0) {
                    tienThang = tienThang * xWild
                    addTop(user, tienThang)
                }
                if (!isWild || tienThang <= 0) {
                    xWild = 0
                    arrXwild = []
                }
                if (tienThang > 0) {
                    let usersss = await User.findById(client.request.session.userId)
                    usersss.vang += tienThang
                    afterBet = usersss.vang
                    usersss.save()
                }
                if (isNohu) {
                    addHisTrungHu({ uid: user._id, username: user.tenhienthi, goldBet: tiencuoc, goldWin: tienThang, result: [qua1.name, qua2.name, qua3.name], beforeBet: beforeBet, afterBet: afterBet, time: Date.now() })
                }
                addHis({ uid: user._id, goldBet: tiencuoc, goldWin: tienThang, result: [qua1.name, qua2.name, qua3.name], beforeBet: beforeBet, afterBet: afterBet, time: Date.now() })
                client.emit("hoaqua/bet", { error: false, result: [qua1.name, qua2.name, qua3.name], x: xWild, win: tienThang, vangUser: beforeBet, vanghu, arrXwild })
            })
        })
    }
}
module.exports = new HoaQua