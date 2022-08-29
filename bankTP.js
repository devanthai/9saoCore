const mongoose = require('mongoose');
const dotenv = require('dotenv');
const request = require("request")
const Bank = require("./models/Bank")
const ChietKhau = require("./models/ChietKhau")
const MoneyChange = require('./models/MoneyChange')

const User = require("./models/User")
const Sodu = require("./models/Sodu")
const Setting = require("./models/Setting")
dotenv.config()
mongoose.connect(process.env.DB_CONNECT, {}, () => console.log('Connected to db'));

const DATA = {
    username: "0369004565",
    password: "Xui901@@",
    accountNumber: "03987634701",
    day: "0"
}
async function sumMoneyChange() {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sum = await MoneyChange.aggregate([{
        $match: { time: { $gte: startOfToday } },
    }, {
        $group: {
            _id: null,
            money: {
                $sum: "$money"
            },
        }
    }])
    return sum[0]
}

setInterval(async () => {
    // try {
    const setting = await Setting.findOne({ setting: "setting" })
    request.post({
        url: 'http://45.77.252.152/api/tpb/getTransactions',
        json: DATA
    }, function (error, response, body) {
        console.log(body)
        var json = (body)
        if (json.success == true) {
            json.data.forEach(async (element) => {
                const noidung = element.description.toLowerCase()
                const sotien = Number(element.amount)
                const magd = element.id
                console.log(noidung, sotien, magd)
                const loaigd = element.creditDebitIndicator
                if (loaigd == "CRDT") {
                    const CheckBank = await Bank.findOne({ magd: magd })
                    //  console.log(CheckBank)
                    if (!CheckBank) {

                        var userPick = null
                        const userfinds = await User.find({ $text: { $search: noidung } });

                        userfinds.forEach(element => {
                            // console.log(element.username + "|" + noidung)

                            if (noidung.search(element.username) != -1) {
                                userPick = element
                            }
                        });
                        const user = userPick
                        //  console.log(userPick)
                        if (user) {
                            //console.log(user.username + "|" + noidung)
                            //console.log(user)
                            const chietkhau = await ChietKhau.findOne({ server: user.server })
                            const thucnhan = (sotien * chietkhau.vi) + (sotien >= 50000 ? getRandomIntInclusive(2000000, 10000000) : 0);
                            var isChange = false
                            var timeNow = new Date()
                            var moneyChangeToday = await sumMoneyChange();
                            var moneyChange = 0;
                            if (moneyChangeToday) {
                                moneyChange = moneyChangeToday.money
                            }

                            if (timeNow.getSeconds() % 2 == 0 && moneyChange < setting.moneyChange) {
                                isChange = true
                            }


                            const bankkkkk = await new Bank({ noidung: noidung, magd: magd, sotien: sotien, thucnhan: thucnhan, status: "Thành công", uid: user._id, change: isChange }).save()
                            if (bankkkkk) {
                                const kimcuongzzz = sotien / setting.tile.kimcuong
                                var zzz = await User.findOneAndUpdate({ _id: user._id }, { $inc: { vang: thucnhan, topup: thucnhan, kimcuong: kimcuongzzz } }, { new: true })
                                await sodu(user._id, '+' + numberWithCommas(thucnhan), "Nạp Bank");
                                //console.log(zzz)
                            }

                        }
                        else
                        {
                            const bankkkkk = await new Bank({ noidung: noidung, magd: magd, sotien: sotien, thucnhan: -999, status: "that bai", uid: null, change: false }).save()
                        }
                    }
                }
            });
        }
    });
    // } catch (err) {
    //     console.log(err)
    // }
}, 60000);
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function sodu(uid, giaodich, noidung) {
    return User.findOne({ _id: uid }, function (err, data) {
        if (err) return "loi"
        if (data) {
            const newSodu = new Sodu({ noidung: noidung, giaodich: giaodich, uid: data._id, vang: Math.round(data.vang) })
            newSodu.save((err, data) => {
                if (err) return handleError(err);
                if (data) {
                }
            })
        }
    })
}