const Hu = require("../models/minipoke/Hu")
const User = require("../models/User")

//top thắng
const keyTopSpinPoke = "TopSpinPoke"

//lịch sử quay: lấy key+uid là ra
const keyHisSpin = "hisSpinPoke"

//lịch sử trúng hũ
const keyHistrunghu = "hisTrunghu"


const redis = require('redis')
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    redisClient.connect()
    console.log("Error " + err)
});
redisClient.connect()




class MiniPoke {

    game = (io) => {
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        var arrayPlayer = []
        var isBaoTri = false
        const tempbai = [
            { name: "21", bai: 2, type: 1 },
            { name: "22", bai: 2, type: 2 },
            { name: "23", bai: 2, type: 3 },
            { name: "24", bai: 2, type: 4 },

            { name: "31", bai: 3, type: 1 },
            { name: "32", bai: 3, type: 2 },
            { name: "33", bai: 3, type: 3 },
            { name: "34", bai: 3, type: 4 },

            { name: "41", bai: 4, type: 1 },
            { name: "42", bai: 4, type: 2 },
            { name: "43", bai: 4, type: 3 },
            { name: "44", bai: 4, type: 4 },

            { name: "51", bai: 5, type: 1 },
            { name: "52", bai: 5, type: 2 },
            { name: "53", bai: 5, type: 3 },
            { name: "54", bai: 5, type: 4 },

            { name: "61", bai: 6, type: 1 },
            { name: "62", bai: 6, type: 2 },
            { name: "63", bai: 6, type: 3 },
            { name: "64", bai: 6, type: 4 },

            { name: "71", bai: 7, type: 1 },
            { name: "72", bai: 7, type: 2 },
            { name: "73", bai: 7, type: 3 },
            { name: "74", bai: 7, type: 4 },

            { name: "81", bai: 8, type: 1 },
            { name: "81", bai: 8, type: 2 },
            { name: "83", bai: 8, type: 3 },
            { name: "84", bai: 8, type: 4 },

            { name: "91", bai: 9, type: 1 },
            { name: "92", bai: 9, type: 2 },
            { name: "93", bai: 9, type: 3 },
            { name: "94", bai: 9, type: 4 },

            { name: "101", bai: 10, type: 1 },
            { name: "102", bai: 10, type: 2 },
            { name: "103", bai: 10, type: 3 },
            { name: "104", bai: 10, type: 4 },

            { name: "j1", bai: 11, type: 1 },
            { name: "j2", bai: 11, type: 2 },
            { name: "j3", bai: 11, type: 3 },
            { name: "j4", bai: 11, type: 4 },

            { name: "q1", bai: 12, type: 1 },
            { name: "q2", bai: 12, type: 2 },
            { name: "q3", bai: 12, type: 3 },
            { name: "q4", bai: 12, type: 4 },

            { name: "k1", bai: 13, type: 1 },
            { name: "k2", bai: 13, type: 2 },
            { name: "k3", bai: 13, type: 3 }, //46
            { name: "k4", bai: 13, type: 4 }, //47

            { name: "a1", bai: 14, type: 1 }, //48
            { name: "a2", bai: 14, type: 2 }, //49
            { name: "a3", bai: 14, type: 3 },
            { name: "a4", bai: 14, type: 4 },
        ]
        function sendMess(client, mess) {
            client.emit("message-poke", mess)
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
            redisClient.publish("addTop", JSON.stringify({ username: user.tenhienthi, vangwin }))
        }
        function addHis(data) {
            redisClient.publish("addHis", JSON.stringify(data))
        }
        function addHisTrungHu(data) {
            redisClient.publish("addHisTrungHu", JSON.stringify(data))
        }
        io.on('connection', client => {
            client.on('connect_failed', function () {
                console.log("Sorry, there seems to be an issue with the connection!");
            })
            client.on('connect_error', function () {
                console.log("Sorry, there seems to be an issue with the connection!");
            })
            client.on('poke/changeMucBet', muccuoc => {
                if (muccuoc != 1 && muccuoc != 2 && muccuoc != 3) {
                    sendMess(client, { error: 1, message: "Tha em" })
                }
                else {
                    Hu.findOne({ muccuoc: muccuoc, isBum: false }, '', (err, data) => {
                        if (!data) {
                            var vanghuCreate = 0
                            if (muccuoc == 1) {
                                vanghuCreate = 1000000000
                            } else if (muccuoc == 2) {
                                vanghuCreate = 5000000000
                            }
                            else if (muccuoc == 3) {
                                vanghuCreate = 20000000000
                            }
                            Hu.create({ vanghu: vanghuCreate, muccuoc: muccuoc }, function (err, hu) {
                                if (err) {
                                    sendMess(client, { error: 1, message: "Loi" })
                                }
                                else {
                                    client.emit("poke/changeMucBet", hu)
                                }
                            });
                        }
                        else {
                            client.emit("poke/changeMucBet", data)
                        }
                    })
                }
            })
            client.on("poke/baotri", async (data) => {
                isBaoTri = !isBaoTri
                sendMess(client, { error: 0, message: "ok " + isBaoTri })
            })
            client.on("poke/getHis", async (data) => {
                if (isBaoTri) {
                    client.emit("poke/bet", { error: 1, message: "Đang bảo trì vui lòng quay lại sau" })
                }
                else if (!client.request.session.userId) {
                    sendMess(client, { error: 1, message: "Vui lòng đăng nhập" })
                }
                else {
                    var hisdata = await redisClient.get(keyHisSpin + client.request.session.userId.toString())
                    hisdata = hisdata ? JSON.parse(hisdata) : []
                    client.emit("poke/gethis", hisdata.slice(0, 1000))
                }
            })
            client.on("poke/getTop", async (data) => {
                if (isBaoTri) {
                    client.emit("poke/bet", { error: 1, message: "Đang bảo trì vui lòng quay lại sau" })
                }
                else {
                    var topdata = await redisClient.get(keyTopSpinPoke)
                    topdata = topdata ? JSON.parse(topdata) : []
                    client.emit("poke/getTop", topdata.slice(0, 20))
                }
            })
            client.on("poke/getNoHu", async (data) => {
                if (isBaoTri) {
                    client.emit("poke/bet", { error: 1, message: "Đang bảo trì vui lòng quay lại sau" })
                }
                else {
                    var hudata = await redisClient.get(keyHistrunghu)
                    hudata = hudata ? JSON.parse(hudata) : []
                    client.emit("poke/getNoHu", hudata)
                }
            })
            client.on("poke/bet", async (data) => {
                if (isBaoTri) {
                    client.emit("poke/bet", { error: 1, message: "Đang bảo trì vui lòng quay lại sau" })
                }
                else if (!client.request.session.userId) {
                    client.emit("poke/bet", { error: 1, message: "Vui lòng đăng nhập" })
                }
                else {
                    try
                    {
                        if (arrayPlayer.includes(client.request.session.userId)) {
                            return client.emit("poke/bet", { error: 3, message: "Chậm lại nào" })
                        }
                        else {
                            arrayPlayer.push(client.request.session.userId)
                            const timeout = setTimeout(() => {
                                const indexP = arrayPlayer.findIndex(p => p == client.request.session.userId)
                                if (indexP != -1) {
                                    arrayPlayer.splice(indexP, 1);
                                    clearTimeout(timeout)
                                }
                            }, 800);
                        }
                    }
                    catch{}


                    var user = await User.findOne({ _id: client.request.session.userId })
                    if (!user) {
                        return client.emit("poke/bet", { error: 1, message: "Vui lòng đăng nhập" })
                    }
                    else {
                        const { muc } = data
                        var tiencuoc = 0
                        if (muc == 1) {
                            tiencuoc = 1000000
                        }
                        else if (muc == 2) {
                            tiencuoc = 10000000
                        }
                        else if (muc == 3) {
                            tiencuoc = 100000000
                        }
                        else {
                            return sendMess(client, { error: 1, message: "zz" })
                        }
                        if (user.vang <= 2000000) {
                            return client.emit("poke/bet", { error: 1, message: "Yêu cầu số dư trên 2tr vàng" })
                        }
                        if (user.vang < tiencuoc) {
                            return client.emit("poke/bet", { error: 1, message: "Bạn Không đủ vàng để quay" })
                        }

                        var vangUser = 0


                        //console.log("Vàng trước khi bet: ", numberWithCommas(user.vang))
                        var beforeBet = user.vang
                        var afterBet = 0

                        user.vang -= tiencuoc

                        user.save()
                        vangUser = user.vang
                        afterBet = vangUser


                        // console.log("gold after bet: ", numberWithCommas(user.vang))
                        tempbai.sort(() => Math.random() - 0.5);
                        var randomArrayBai = []
                        for (let i = 0; i < 5; i++) {
                            let numberRan = Math.floor(Math.random() * tempbai.length)
                            while (randomArrayBai.includes(numberRan)) {
                                numberRan = Math.floor(Math.random() * tempbai.length)
                            }
                            randomArrayBai.push(numberRan)
                        }
                        console.log(randomArrayBai)
                        var arrayBai = []
          
                        randomArrayBai.map(ran => { return arrayBai.push(tempbai[ran]) })
                        arrayBai.sort(dynamicSort("bai"))


                        //test


                      


                        //test

                        const lookup = arrayBai.reduce((a, e) => {
                            a[e.bai] = ++a[e.bai] || 0;
                            return a;
                        }, {});
                        var baiTrungs = arrayBai.filter(e => lookup[e.bai])




                        const countsBaiTrung = {}
                        baiTrungs.forEach(function (x) { countsBaiTrung[x.bai] = (countsBaiTrung[x.bai] || 0) + 1; });
                        const keysBaiTrung = Object.keys(countsBaiTrung)


                        var isXam = false
                        var isDoij = false
                        var countDoi = 0
                        keysBaiTrung.forEach((key) => {
                            if (countsBaiTrung[key] > 2) {
                                isXam = true
                            }
                            if (countsBaiTrung[key] > 1) {
                                countDoi++
                            }
                            if (countsBaiTrung[key] > 1 && Number(key) > 10) {
                                isDoij = true
                            }
                        })

                        var vangWin = 0
                        var mess = ""

                        //đôi j++
                        if (isDoij) {
                            vangWin = tiencuoc * 2.5
                            mess = "Đôi J++"
                        }

                        //2 đôi
                        if (countDoi > 1) {
                            vangWin = tiencuoc * 5
                            mess = "2 đôi"
                        }

                        //xám
                        if (isXam) {
                            vangWin = tiencuoc * 8
                            mess = "Xám"
                        }

                        //sanh
                        var isSảnh = true
                        for (let i = 1; i < arrayBai.length; i++) {
                            if (arrayBai[i].bai != arrayBai[i - 1].bai + 1) {
                                isSảnh = false
                                break
                            }
                        }
                        if (isSảnh) {
                            vangWin = tiencuoc * 13
                            mess = "Sảnh"
                        }

                        //Thùng
                        var isthung = false
                        var baitype = arrayBai[0].type
                        if (arrayBai[1].type == baitype && arrayBai[2].type == baitype && arrayBai[3].type == baitype && arrayBai[4].type == baitype) {
                            vangWin = tiencuoc * 20
                            isthung = true
                            mess = "Thùng"
                        }

                        //Cù lũ
                        //3 cây trùng và 2 cây trung
                        if (keysBaiTrung.length == 2 && ((Number(countsBaiTrung[keysBaiTrung[0]]) == 3 && Number(countsBaiTrung[keysBaiTrung[1]] == 2)) || (Number(countsBaiTrung[keysBaiTrung[0]]) == 2 && Number(countsBaiTrung[keysBaiTrung[1]] == 3)))) {
                            vangWin = tiencuoc * 50
                            mess = "Cù Lũ"
                        }

                        //tứ quý
                        if ((keysBaiTrung.length == 1 || keysBaiTrung.length == 2) && (Number(countsBaiTrung[keysBaiTrung[0]]) == 4 || Number(countsBaiTrung[keysBaiTrung[1]]) == 4 || Number(countsBaiTrung[keysBaiTrung[0]]) == 5)) {
                            vangWin = tiencuoc * 150
                            mess = "Tứ quý"
                        }

                        //thung phá sảnh
                        if (isthung && isSảnh) {
                            vangWin = tiencuoc * 1000
                            mess = "Thùng phá sảnh"
                        }


                        var ishaveJ = false
                        for (let i = 0; i < arrayBai.length; i++) {
                            if (arrayBai[i].bai == 11) {
                                ishaveJ = true
                                break
                            }
                        }


                        var muccuoc = 1
                        var vanghu = 0
                        if (tiencuoc == 1000000) {
                            muccuoc = 1
                        }
                        else if (tiencuoc == 10000000) {
                            muccuoc = 2
                        }
                        else {
                            muccuoc = 3
                        }
                        var huuuu = await Hu.findOne({ muccuoc: muccuoc, isBum: false })
                        vanghu = huuuu ? huuuu.vanghu : 0

                        if (huuuu) {
                            vanghu = huuuu.vanghu
                        }
                        else {
                            var vanghuCreate = 0
                            if (muccuoc == 1) {
                                vanghuCreate = 1000000000
                            } else if (muccuoc == 2) {
                                vanghuCreate = 5000000000
                            }
                            else if (muccuoc == 3) {
                                vanghuCreate = 20000000000
                            }
                            Hu.create({ vanghu: vanghuCreate, muccuoc: muccuoc }, function (err, hu) {
                                vanghu = hu ? hu.vanghu : 0
                            });
                        }


                        var isnohu = false
                        //thung phá sảnh j
                        if (isthung && isSảnh && ishaveJ) {
                            vangWin = tiencuoc * 100000
                            isnohu = true
                            if (huuuu) {
                                huuuu.isBum = true
                                huuuu.winner = user.tenhienthi
                                vangWin = tiencuoc + huuuu.vanghu
                                huuuu.save()

                                var vanghuCreate = 0
                                if (muccuoc == 1) {
                                    vanghuCreate = 1000000000
                                } else if (muccuoc == 2) {
                                    vanghuCreate = 5000000000
                                }
                                else if (muccuoc == 3) {
                                    vanghuCreate = 20000000000
                                }
                                Hu.create({ vanghu: vanghuCreate, muccuoc: muccuoc }, function (err, hu) {
                                    vanghu = hu ? hu.vanghu : 0
                                });
                            }
                            mess = "Nổ hũ"
                        }

                        if (vangWin > 0) {

                            var usersss = await User.findById(client.request.session.userId)
                            if (usersss) {
                                usersss.vang = Number(usersss.vang) + Number(vangWin)
                                await usersss.save();
                                vangUser = usersss.vang
                                afterBet = vangUser
                                addTop(usersss, vangWin)
                                console.log(usersss.tenhienthi + " thắng " + numberWithCommas(vangWin) + " sd: " + (afterBet))
                            }
                        }

                        if (isnohu) {
                            addHisTrungHu({ uid: user._id, username: user.tenhienthi, goldBet: tiencuoc, goldWin: vangWin, result: arrayBai, beforeBet: beforeBet, afterBet: afterBet, time: Date.now() })
                        }



                        var rsNameBai = arrayBai.map(a => a.name)

                        addHis({ uid: user._id, goldBet: tiencuoc, goldWin: vangWin, result: arrayBai, beforeBet: beforeBet, afterBet: afterBet, time: Date.now() })

                        if (vangWin > 0) {
                            return client.emit("poke/bet", { error: 0, result: rsNameBai, win: mess + " +" + numberWithCommas(vangWin), isnohu, vangWin, vangUser, vanghu })
                        }
                        client.emit("poke/bet", { error: 0, result: rsNameBai, isnohu, vangWin, vangUser, vanghu })
                    }
                }
            })
        })
    }
}
module.exports = new MiniPoke