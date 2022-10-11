const Hu = require("../models/hoaqua/Hu")
const User = require("../models/User")

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
        io.on("connection", client => {
            client.on('connect_failed', function () {
                console.log("Sorry, there seems to be an issue with the connection!");
            })
            client.on('connect_error', function () {
                console.log("Sorry, there seems to be an issue with the connection!");
            })
            client.on('hoaqua/changeMucBet', muccuoc => {
                console.log(muccuoc)
                if (muccuoc != 1 && muccuoc != 2 && muccuoc != 3 && muccuoc != 4) {
                    sendMess(client, { error: 1, message: "Tha em" })
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
                                    sendMess(client, { error: 1, message: "Loi" })
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
                    return sendMess(client, { error: 1, message: "Lỗi" })
                }
                if (!client.request.session.userId) {
                    return client.emit("hoaqua/bet", { error: true, message: "Vui lòng đăng nhập" })
                }

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

                const beforeBet = user.vang
                let afterBet = 0

                user.vang -= tiencuoc
                afterBet = user.vang
                user.save()



                const listHoaquas = [
                    { type: 1, name: "chuong" },
                    { type: 2, name: "wild" },
                    { type: 3, name: "777" },
                    { type: 4, name: "cam" },
                    { type: 5, name: "cherry" },
                    { type: 6, name: "duahau" },
                    { type: 7, name: "chanh" },
                ]
                let qua1 = listHoaquas[Math.floor(Math.random() * listHoaquas.length)]
                let qua2 = listHoaquas[Math.floor(Math.random() * listHoaquas.length)]
                let qua3 = listHoaquas[Math.floor(Math.random() * listHoaquas.length)]




                

                client.emit("hoaqua/bet", { error: false, result: [qua1.name, qua2.name, qua3.name], x: 1 })
            })
        })
    }
}
module.exports = new HoaQua