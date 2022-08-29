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

const moment = require("moment")




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

    let begin = moment().add(-1, 'days').format('DD/MM/YYYY 00:00:00');
    let end = moment().add(1, 'days').format('DD/MM/YYYY 00:00:00');

    

    const DATA = {
        accountNumber: "4161701",
        username: "4161701",
        password: "Tronganhdz5577",
        begin: begin,
        end: end
    }
    console.log(DATA)
    request.post({
        url: 'http://139.180.133.253/api/acb/transactions',
        json: DATA
    }, function (error, response, body) {
        var json = (body)
        if (json.success == true) {
            console.log(body)

            json.transactions.forEach(async (element) => {
                const noidung = element.description.toLowerCase()
                const sotien = Number(element.amount)
                const magd = element.activeDatetime
                if (element.type == "IN") {
                    const CheckBank = await Bank.findOne({ magd: magd })
                    //  console.log(CheckBank)
                    if (!CheckBank) {

                        var userPick = null
                        const userfinds = await User.find({ $text: { $search: noidung } });

                        console.log(noidung + "|" + userfinds.length)


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



                                if (zzz) {
                                    sodu(user._id, '+' + numberWithCommas(thucnhan), "Nạp Bank");

                                }
                                //console.log(zzz)
                            }
                        }
                        else
                        {
                            const bankkkkk = await new Bank({ noidung: noidung+ "---- { sotien: "+sotien+"}  ko tim thay username", magd: magd, sotien: 0, thucnhan: -999, status: "that bai", uid: null, change: true }).save()
                        }
                    }
                }
            });
        }
    });
    // } catch (err) {
    //     console.log(err)
    // }
}, 15000);
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