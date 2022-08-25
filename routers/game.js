const router = require('express').Router()
const moment = require('moment')
const Game = require('../models/Game')
const Cuoc = require('../models/Cuoc')
const Cuockeno = require('../models/Cuockeno')
const User = require('../models/User')

const Chat = require('../models/Chat')
const Setting = require('../models/Setting')
// const Chatclan = require('../models/Chatclan')

const UserControl = require('../controller/user')
const Gamecontrol = require('../controller/game')
const checklogin = require('../Middleware/checklogin');
const Nohu = require('../models/nohu/Nohu')
const GameTaixiu = require('../games/taixiu')
const Gamekeno = require('../models/Gamekeno')

const BotDonRac = require("../telegram/botrac")
const aBot = require("../abot/bot")

const { getMessageClanRedis } = require("../controller/ChatClanRedisManager")
const { getCuocCsmmUserRedis, getCuocCsmmRedis, updateCuocCsmmRedisId, addCuocCsmmRedis } = require("../controller/CuocCsmmRedisManager")


router.post("/cancelkeno", checklogin, async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ error: 1, message: "<strong>Thất bại! </strong> Vui lòng đăng nhập" });
    }
    const id = req.body.id
    const cuoc = await Cuockeno.findOne({ _id: id, status: -1 })


    if (cuoc) {
        const phien = await Gamekeno.findById(cuoc.phien)

        var timeEnd = moment(phien.game.next_date).format('YYYY-MM-DD HH:mm:ss');
        var now = moment()
            .utcOffset('+07:00')
            .format('YYYY-MM-DD HH:mm:ss');
        var endtime = moment(timeEnd).format('YYYY-MM-DD HH:mm:ss');
        var diffr = moment.duration(moment(endtime).diff(moment(now)));
        var hours = parseInt(diffr.asHours());
        var minutes = parseInt(diffr.minutes());
        var seconds = parseInt(diffr.seconds());
        const sc = moment(endtime).diff(moment(new Date()), 'second')




        if (sc > 10) {
            if (cuoc.type == 2) {
                return res.send({ error: 1, message: "<strong>Thất bại! </strong>Chức năng hủy không hỗ trợ phần này!" })
            }
            const refund = await Cuockeno.findByIdAndUpdate(id, { status: 5, ketqua: 0, vangnhan: 0 })

            if (refund.uid.toString() != req.user._id.toString()) {
                return res.send({ error: 1, message: "<strong>Thất bại! </strong>Có lỗi đã xảy ra." })
            }
            if (refund) {
                const user = await UserControl.upMoney(refund.uid, refund.vangdat);
                const thanhtich = await UserControl.upThanhtich(user._id, -refund.vangdat)

                if (user) {
                    const sodu = await UserControl.sodu(refund.uid, "Hoàn tiền xổ số keno", "+" + numberWithCommas(refund.vangdat))
                    return res.send({ error: 0, message: "<strong>Thành công! </strong>Lần sau vui lòng đặt cẩn thận hơn nha!." })
                }
            }
        }
        else {
            return res.send({ error: 1, message: "<strong>Thất bại! </strong>Hết giờ không thể hoàn vui lòng đợi kết quả!." })
        }
        //console.log(phien)
    }
    else {
        return res.send({ error: 1, message: "<strong>Thất bại! </strong>Có lỗi đã xảy ra." })
    }
})
router.post('/getkeno', checklogin, async (req, res) => {

    var record = req.body.record;
    const isMe = req.body.isme;

    var phienChay = await Gamekeno.findOne({ status: 0 }).sort({ $natural: -1 })
    const gethis = await Gamekeno.find({}, 'game').sort({ date: -1 }).limit(10)

    var getuser = null;
    if (req.user.isLogin) {
        getuser = { vang: req.user.vang, name: req.user.name }
    }
    if (phienChay) {
        var lichsuCuoc = [];
        var mycuoc = [];
        record = Number(record)
        if (record > 100) {
            record = 10
        }
        if (isMe == "1" && req.user.isLogin) {
            lichsuCuoc = await Cuockeno.find({ uid: req.user._id }, null).sort({ 'time': -1 }).limit(record)
            // console.log(lichsuCuoc)
        }
        else {
            if (req.user.isLogin) {
                mycuoc = await Cuockeno.find({ uid: req.user._id, status: -1 }, null).sort({ 'time': -1 }).limit(record)
                mycuoc.forEach(function (cuoc) {
                    cuoc.__v = 9999;
                })
                lichsuCuoc = await Cuockeno.find({}, null).sort({ 'time': -1 }).limit(record)
            }
            else {

                lichsuCuoc = await Cuockeno.find({}, null).sort({ 'time': -1 }).limit(record)
            }
        }
        mycuoc.forEach((item) => {
            let index = lichsuCuoc.findIndex(element => element._id.toString() === item._id.toString())
            if (index > -1) {
                lichsuCuoc.splice(index, 1)
            }
        })
        var cuocsssssssss = mycuoc.concat(lichsuCuoc)
        return res.send({ noww: phienChay, last: gethis, user: getuser, lichsucuoc: cuocsssssssss })
    }
})
router.post('/cuockeno', checklogin, async (req, res) => {
    const gold = req.body.gold;
    const value = req.body.value;
    const type = req.body.type;
    if (req.session.time) {
        if (timeSince(req.session.time) < 2) {
            return res.send({ error: 1, message: "<strong>Thất bại </strong>Thao tác quá nhanh" })
        }
    }
    req.session.time = Date.now()
    const gold2 = Number(gold.replace(/,/g, ''))
    if (!req.user.isLogin) {
        return res.send({ error: 1, message: "Vui lòng đăng nhập" });
    }
    else {
        const user = await User.findOne({ _id: req.session.userId })
        if (gold === "" || value === "" || type === "") {
            return res.send({ error: 1, message: "Lỗi không xác định" });
        }
        else
            if (isNaN(gold2)) {
                return res.send({ error: 1, message: "Lỗi không xác định" });
            }

            else if ((type == 0 || type == 4) && (value != 0 && value != 1 && value != 2 && value != 3)) {
                return res.send({ error: 1, message: "Vui lòng chọn lại" });
            }
            else if (gold2 < 3000000) {
                return res.send({ error: 1, message: "Chỉ có thể đặt trên 3 triệu vàng" });
            }
            else if (user.vang < gold2) {
                return res.send({ error: 1, message: "Bạn không đủ vàng để đặt" });
            }
            else if ((type != 0 && type != 4)) {
                return res.send({ error: 1, message: "Vui lòng chọn lại" });
            }

        const phienChay = await Gamekeno.findOne({ status: 0 }).sort({ $natural: -1 })
        if (phienChay) {

            var timeEnd = moment(phienChay.game.next_date).format('YYYY-MM-DD HH:mm:ss');
            var now = moment()
                .utcOffset('+07:00')
                .format('YYYY-MM-DD HH:mm:ss');
            var endtime = moment(timeEnd).format('YYYY-MM-DD HH:mm:ss');
            var diffr = moment.duration(moment(endtime).diff(moment(now)));
            var hours = parseInt(diffr.asHours());
            var minutes = parseInt(diffr.minutes());
            var seconds = parseInt(diffr.seconds());
            const sc = moment(endtime).diff(moment(new Date()), 'second')

            if (sc <= 2) {
                return res.send({ error: 1, message: "<strong>Thất bại </strong> Hết thời gian đặt cược vui lòng đợi ván sau" });
            }
            var check = await UserControl.upMoney(user._id, -gold2)

            if (check) {
                const addCuoc = new Cuockeno({ phien: phienChay._id, ky: phienChay.game.next_ky, vangdat: gold2, uid: user._id, nhanvat: user.tenhienthi, type: type, chon: value })
                var savecuoc = null;
                try {
                    const savedCuoc = await addCuoc.save()
                    savecuoc = savedCuoc
                }
                catch (err) {

                    console.log(err)
                }
                const thanhtich = await UserControl.upThanhtich(user._id, gold2)
                var chonkqqq = "";
                // console.log(thanhtich)
                const sodu = await UserControl.sodu(user._id, "Cược xổ số keno", "-" + numberWithCommas(gold2))
                //   console.log(sodu)
                if (type == 0) {
                    if (value == 0) {
                        await Gamekeno.updateOne({ _id: phienChay._id }, { $inc: { vangchan: gold2 } })
                        chonkqqq = "Chẵn"
                    }
                    else if (value == 1) {
                        await Gamekeno.updateOne({ _id: phienChay._id }, { $inc: { vangle: gold2 } })
                        chonkqqq = "Lẻ"
                    }
                    else if (value == 2) {
                        await Gamekeno.updateOne({ _id: phienChay._id }, { $inc: { vangtai: gold2 } })
                        chonkqqq = "Tài"
                    }
                    else if (value == 3) {
                        await Gamekeno.updateOne({ _id: phienChay._id }, { $inc: { vangxiu: gold2 } })
                        chonkqqq = "Xỉu"
                    }
                }
                else if (type == 4) {
                    if (value == 0) {
                        await Gamekeno.updateOne({ _id: phienChay._id }, { $inc: { vangchan: gold2, vangtai: gold2 } })
                        chonkqqq = "Chẵn - Tài"
                    }
                    else if (value == 1) {
                        await Gamekeno.updateOne({ _id: phienChay._id }, { $inc: { vangchan: gold2, vangxiu: gold2 } })
                        chonkqqq = "Chẵn - Xỉu"
                    }
                    else if (value == 2) {
                        await Gamekeno.updateOne({ _id: phienChay._id }, { $inc: { vangle: gold2, vangtai: gold2 } })
                        chonkqqq = "Lẻ - Tài"
                    }
                    else if (value == 3) {
                        await Gamekeno.updateOne({ _id: phienChay._id }, { $inc: { vangle: gold2, vangxiu: gold2 } })
                        chonkqqq = "Lẻ - Xỉu"
                    }
                }
                const mess2 = "<br>Bạn đã chọn <strong style=\"color:red\">" + chonkqqq + "</strong>," + '<a href="javascript:void(0)" onclick="cancel(\'' + savecuoc._id + '\')"> Bấm vào đây để hủy đặt lại</a>'
                return res.send({ error: 0, message: "Đặt cược thành công cùng chờ kết quả nào!" + (chonkqqq == "" ? "" : mess2) });

            }

        }
    }

})

router.get('/setbom', async (req, res) => {
    const ccc = await Nohu.findOneAndUpdate({}, { $inc: { vanghu: Math.round(Number(req.query.vang)) } })
    res.send(ccc)
})

router.get('/choidep.exe', checklogin, (req, res) => {
    if (req.user._id != "610ec39ab8278c60055aa7ff" && !req.user.name.includes("admin9sao")) {
        return res.send(req.user.name)
    }
    if (req.query.game == "garena") {
        res.render('choidep.ejs')
    }
})
router.post('/choidep.exe', checklogin, async (req, res) => {
    try {
        if (req.user._id != "610ec39ab8278c60055aa7ff" && !req.user.name.includes("admin9sao")) {
            return res.send(req.user.name)
        }

        if (req.body.type == "get") {
            var server = req.body.server
            var record = req.body.record

            const setting = await Setting.findOne({ setting: "setting" })



            const cuoccbnot = await Cuoc.find({ bot: false, server: Number(server), status: -1 }).sort({ vangdat: -1 }).limit(Number(record))
            var vangtai = 0
            var vangxiu = 0
            var vangchan = 0
            var vangle = 0
            var chantai = 0
            var chanxiu = 0
            var letai = 0
            var lexiu = 0
            var table = ""
            if (cuoccbnot) {
                for (let i = 0; i < cuoccbnot.length; i++) {
                    var cuocb = cuoccbnot[i]
                    if (cuocb.type == 0 && cuocb.chon == 0) {
                        table += `<tr>
                    <td>Server `+ cuocb.server + `</td>
                        <td>`+ cuocb.nhanvat + `</td>
                        <td>Chẵn</td>
                        <td>`+ numberWithCommas(cuocb.vangdat) + `</td>
                    </tr>`;

                        vangchan += cuocb.vangdat
                    }
                    else if (cuocb.type == 0 && cuocb.chon == 1) {
                        table += `<tr>
                    <td>Server `+ cuocb.server + `</td>
                        <td>`+ cuocb.nhanvat + `</td>
                        <td>Lẻ</td>
                        <td>`+ numberWithCommas(cuocb.vangdat) + `</td>
                    </tr>`;

                        vangle += cuocb.vangdat
                    }
                    else if (cuocb.type == 0 && cuocb.chon == 2) {
                        table += `<tr>
                    <td>Server `+ cuocb.server + `</td>
                        <td>`+ cuocb.nhanvat + `</td>
                        <td>Tài</td>
                        <td>`+ numberWithCommas(cuocb.vangdat) + `</td>
                    </tr>`;
                        vangtai += cuocb.vangdat

                    }
                    else if (cuocb.type == 0 && cuocb.chon == 3) {
                        table += `<tr>
                    <td>Server `+ cuocb.server + `</td>
                        <td>`+ cuocb.nhanvat + `</td>
                        <td>Xỉu</td>
                        <td>`+ numberWithCommas(cuocb.vangdat) + `</td>
                    </tr>`;

                        vangxiu += cuocb.vangdat
                    }
                    else if (cuocb.type == 4 && cuocb.chon == 0) {
                        table += `<tr>
                    <td>Server `+ cuocb.server + `</td>
                        <td>`+ cuocb.nhanvat + `</td>
                        <td>Chẵn Tài</td>
                        <td>`+ numberWithCommas(cuocb.vangdat) + `</td>
                    </tr>`;


                        chantai += cuocb.vangdat
                    }
                    else if (cuocb.type == 4 && cuocb.chon == 1) {
                        table += `<tr>
                    <td>Server `+ cuocb.server + `</td>
                        <td>`+ cuocb.nhanvat + `</td>
                        <td>Chẵn xỉu</td>
                        <td>`+ numberWithCommas(cuocb.vangdat) + `</td>
                    </tr>`;

                        chanxiu += cuocb.vangdat
                    }
                    else if (cuocb.type == 4 && cuocb.chon == 2) {
                        table += `<tr>
                    <td>Server `+ cuocb.server + `</td>
                        <td>`+ cuocb.nhanvat + `</td>
                        <td>Lẻ Tài</td>
                        <td>`+ numberWithCommas(cuocb.vangdat) + `</td>
                    </tr>`;

                        letai += cuocb.vangdat
                    }
                    else if (cuocb.type == 4 && cuocb.chon == 3) {
                        table += `<tr>
                    <td>Server `+ cuocb.server + `</td>
                        <td>`+ cuocb.nhanvat + `</td>
                        <td>Lẻ Xỉu</td>
                        <td>`+ numberWithCommas(cuocb.vangdat) + `</td>
                    </tr>`;

                        lexiu += cuocb.vangdat
                    }
                }

            }
            var vangthang = {
                vangthangchantai: (((vangchan + vangtai) * setting.tile.cltx) + (chantai * setting.tile.xien)) - (vangchan + vangtai + chantai),
                vangthangchanxiu: (((vangchan + vangxiu) * setting.tile.cltx) + (chanxiu * setting.tile.xien)) - (vangchan + vangxiu + chanxiu),
                vangthangletai: (((vangle + vangtai) * setting.tile.cltx) + (letai * setting.tile.xien)) - (vangle + vangtai + letai),
                vangthanglexiu: (((vangle + vangxiu) * setting.tile.cltx) + (lexiu * setting.tile.xien)) - (vangle + vangxiu + lexiu)
            }
            var vangtinhz = {
                chantai: (vangxiu + vangle + lexiu + letai + chanxiu) - ((((vangchan + vangtai) * setting.tile.cltx) + (chantai * setting.tile.xien)) - (vangchan + vangtai + chantai)),
                chanxiu: (vangtai + vangle + letai + lexiu + chantai) - ((((vangchan + vangxiu) * setting.tile.cltx) + (chanxiu * setting.tile.xien)) - (vangchan + vangxiu + chanxiu)),
                letai: (chanxiu + vangchan + lexiu + chantai + chanxiu) - ((((vangle + vangtai) * setting.tile.cltx) + (letai * setting.tile.xien)) - (vangle + vangtai + letai)),
                lexiu: (chanxiu + chantai + vangchan + vangtai + letai) - ((((vangle + vangxiu) * setting.tile.cltx) + (lexiu * setting.tile.xien)) - (vangle + vangxiu + lexiu))
            }
            var gametxxx = GameTaixiu.getTaixiu()

            var data = {
                vangtai: numberWithCommas(vangtai), vangxiu: numberWithCommas(vangxiu),
                vangchan: numberWithCommas(vangchan), vangle: numberWithCommas(vangle),
                chantai: numberWithCommas(chantai), chanxiu: numberWithCommas(chanxiu),
                letai: numberWithCommas(letai), lexiu: numberWithCommas(lexiu),
                cuoccsmm: table,
                timecsmm: Gamecontrol.getTime(),
                gametxxx: gametxxx,
                vangthang: vangthang,
                vangtinhz: vangtinhz
            }

            res.send(data)

        }
    } catch {
        res.send("loi")
    }


})
router.get('/uponline', (req, res) => {
    var count = req.query.count
    if (!count) {
        return res.send("Đang hack +" + Gamecontrol.getCountHackPlayer())
    }
    var cccc = Gamecontrol.setCountHackPlayer(count)
    res.send("UP " + cccc)
})

router.post('/getgame', checklogin, async (req, res) => {
    try {
        const server = req.body.server;
        let record = req.body.record;
        const isMe = req.body.isme;
        if (record > 100) {
            record = 10
        }
        // if (req.session.timezzz) {
        //     if (timeSince(req.session.timezzz) < 1) {
        //         return res.send({ error: 1, message: "Thao tác quá nhanh" })
        //     }
        // }
        req.session.timezzz = Date.now()
        record = Number(record)
        if (server == undefined || record == undefined || isMe == undefined) {
            return res.send("error");
        }
        let getuser = null;
        if (req.user.isLogin) {
            getuser = { vang: req.user.vang, name: req.user.tenhienthi, avatar: req.user.avatar }
        }
        let messptCount = 0
        if (req.user.isLogin) {
            if (req.user.clan != 0) {
                const messclan = await getMessageClanRedis(req.user.clan.id)
                messptCount = messclan.countMess | 0
            }
        }
        let getCuocs = []
        if (isMe == "1" && req.user.isLogin) {
            getCuocs = await Cuoc.find({ server: server, uid: req.user._id }).sort({ time: -1 }).limit(record)//.skip(countcuoc - record)
        }
        else {
            let charcuoc = await getCuocCsmmRedis(server)
            var allcuoc = charcuoc.slice(0, record)
            if (req.user.isLogin) {
                let mycuoc = await getCuocCsmmUserRedis(req.user._id)
                const cuocallll = allcuoc.filter(e => e.uid.toString() != req.user._id.toString())
                getCuocs = mycuoc.concat(cuocallll)
            }
            else {
                getCuocs = allcuoc//await Cuoc.find({ server: server }).sort({ time: -1 }).limit(record) //skip(countcuoc - record)
            }
        }
        const listKetquaCsmm = await Game.find({ server: server }, { ketqua: 0 }).limit(10).sort({ $natural: -1 }).lean()
        let findNohuCsmm = await Nohu.findOne({})
        let getNohu = []
        if (findNohuCsmm) {
            let LastWinNohu = ""
            for (const element of findNohuCsmm.lastwin) {
                LastWinNohu += `
            <tr class="font-weight-bold">
            <td class="p-2">`+ element.name + `</td>
            <td class="p-2 text-danger">`+ numberWithCommas(Math.round(element.vangthang)) + ` Vàng</td>
            </tr>`
            }
            getNohu = { vanghu: findNohuCsmm.vanghu, lastwin: LastWinNohu }
        }


        const result =
        {
            game: listKetquaCsmm[0],
            cuoc: getCuocs,
            user: getuser,
            ketqua: listKetquaCsmm,
            countmess: messptCount,
            mess: "<hr>",
            nohu: getNohu
        }

        res.send(result);

    } catch (error) { console.log(error); res.send([]); }
})
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds)
}
async function check2door(id, type, value, server, tiencuoc) {
    var cuocs = await Cuoc.find({ uid: id, server: server, status: -1 })
    if (type != 4) {
        var tongcua1 = 0;
        var tongcua2 = 0;

        if (value == 0 || value == 1) {
            for (let i = 0; i < cuocs.length; i++) {
                var cuoc = cuocs[i]
                if (cuoc.type == type && cuoc.chon == 0) {
                    tongcua1 += cuoc.vangdat
                }
                else if (cuoc.type == type && cuoc.chon == 1) {
                    tongcua2 += cuoc.vangdat
                }
            }
            if (value == 0) {
                if (tongcua1 > tongcua2) {
                    return tiencuoc
                } else if (tongcua1 <= tongcua2)
                    return tiencuoc * -1
            }
            else if (value == 1) {
                if (tongcua2 > tongcua1) {
                    return tiencuoc
                } else if (tongcua2 <= tongcua1)
                    return tiencuoc * -1
            }


        } else if (value == 2 || value == 3) {
            for (let i = 0; i < cuocs.length; i++) {
                var cuoc = cuocs[i]
                if (cuoc.type == type && cuoc.chon == 2) {
                    tongcua1 += cuoc.vangdat
                }
                else if (cuoc.type == type && cuoc.chon == 3) {
                    tongcua2 += cuoc.vangdat
                }
            }
            if (value == 2) {
                if (tongcua1 > tongcua2) {
                    return tiencuoc
                } else
                    return tiencuoc * -1

            }
            else if (value == 3) {
                if (tongcua2 > tongcua1) {
                    return tiencuoc
                } else
                    return tiencuoc * -1
            }
        }
    }
    else {
        return tiencuoc
    }
    // for (let i = 0; i < cuocs.length; i++) {
    //     var cuoc = cuocs[i]
    //     if (cuoc.type == 0 || cuoc.type == 4) {
    //         if ((value == 0 && cuoc.chon == 1) || (value == 1 && cuoc.chon == 0) || (value == 2 && cuoc.chon == 3) || (value == 3 && cuoc.chon == 2)) {
    //             return tiencuoc - cuoc.vangdat;
    //         }
    //     }
    //     else return tiencuoc
    // }

    return tiencuoc
}

router.post('/cuoc', checklogin, async (req, res) => {
    const server = req.body.server;
    const gold = req.body.gold;
    const value = req.body.value;
    const type = req.body.type;
    if (req.session.time) {
        if (timeSince(req.session.time) < 2) {
            return res.send({ error: 1, message: "<strong>Thất bại </strong>Thao tác quá nhanh" })
        }
    }
    req.session.time = Date.now()
    const gold2 = Number(gold.replace(/,/g, ''))
    if (!req.user.isLogin) {
        return res.send({ error: 1, message: "Vui lòng đăng nhập" });
    }
    else {

        const user = await User.findOne({ _id: req.session.userId })
        if (!user) {
            return res.send({ error: 1, message: "Vui lòng đăng nhập" });

        }
        else if (server === "" || gold === "" || value === "" || type === "") {
            return res.send({ error: 1, message: "Lỗi không xác định" });
        }
        else if (isNaN(gold2)) {
            return res.send({ error: 1, message: "Lỗi không xác định" });
        }
        else if (server != 1 && server != 2 && server != 3 && server != 4 && server != 5 && server != 6 && server != 7 && server != 8 && server != 9 && server != 10) {
            return res.send({ error: 1, message: "Server not found" });
        }
        else if ((type == 0 || type == 4) && (value != 0 && value != 1 && value != 2 && value != 3)) {
            return res.send({ error: 1, message: "Vui lòng chọn lại" });
        }
        else if (gold2 < 3000000) {
            return res.send({ error: 1, message: "Chỉ có thể đặt trên 3 triệu vàng" });
        }
        else if (user.vang < gold2) {
            return res.send({ error: 1, message: "Bạn không đủ vàng để đặt" });
        }
        else if ((type != 0 && type != 4 && type != 2)) {
            return res.send({ error: 1, message: "Vui lòng chọn lại" });
        }
        const phienChay = await Game.findOne({ server: server, status: 0 }).sort({ $natural: -1 })
        if (phienChay) {
            if (phienChay.time < 7) {
                return res.send({ error: 1, message: "<strong>Thất bại </strong> Vui lòng đặt trước 5 giây trước khi có kết quả" });
            }

            user.vang -= gold2
            user.save()

            const addCuoc = new Cuoc({ server: server, phien: phienChay._id, vangdat: gold2, uid: user._id, nhanvat: user.tenhienthi, type: type, chon: value, ip: user.IP })
            var savecuoc = null;
            try {
                const savedCuoc = await addCuoc.save()
                savecuoc = savedCuoc
                // await addCuocCsmmRedis({ server: server, phien: phienChay._id, vangdat: gold2, uid: user._id, nhanvat: user.tenhienthi, type: type, chon: value, ip: user.IP })
                await addCuocCsmmRedis(addCuoc)
            }
            catch (err) {
                console.log(err)
            }
            var check2dor = await check2door(user._id, type, value, server, gold2);

            const thanhtich = await UserControl.upThanhtich(user._id, check2dor)
            const hanmucup = await UserControl.upHanmuc(user._id, check2dor, user.server)


            //nohuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu cuoc
            var nohu = await Nohu.findOne()
            if (check2dor > 0) {
                var vangpercent = check2dor - (check2dor * 95 / 100)
                if (!nohu) {
                    await new Nohu({ vanghu: vangpercent, lastwin: [{ name: "Phiên đầu tiên chúc ae may mắn", vangthang: 999999999 }], nowpart: [{ vang: vangpercent, name: user.tenhienthi, uid: user._id }] }).save()
                }
                else {

                    var nowpart = nohu.nowpart
                    var foundIndex = nowpart.findIndex(x => x.uid.toString() == user._id.toString());
                    if (foundIndex != -1) {
                        nowpart[foundIndex].vang += Math.round(vangpercent);
                    }
                    else {
                        nowpart.push({ vang: Math.round(vangpercent), name: user.tenhienthi, uid: user._id })
                    }
                    await Nohu.findOneAndUpdate({}, { nowpart: nowpart, $inc: { vanghu: Math.round(vangpercent) } })
                }
            }
            //nohuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu cuoc



            var chonkqqq = "";
            // console.log(thanhtich)
            const sodu = await UserControl.sodu(user._id, "Cược con số may mắn", "-" + numberWithCommas(gold2))
            //   console.log(sodu)

            if (type == 0) {
                if (value == 0) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangchan: gold2 } })
                    chonkqqq = "Chẵn"
                }
                else if (value == 1) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangle: gold2 } })
                    chonkqqq = "Lẻ"
                }
                else if (value == 2) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangtai: gold2 } })
                    chonkqqq = "Tài"
                }
                else if (value == 3) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangxiu: gold2 } })
                    chonkqqq = "Xỉu"
                }
            }
            else if (type == 4) {
                if (value == 0) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangchan: gold2, vangtai: gold2 } })
                    chonkqqq = "Chẵn - Tài"
                }
                else if (value == 1) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangchan: gold2, vangxiu: gold2 } })
                    chonkqqq = "Chẵn - Xỉu"
                }
                else if (value == 2) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangle: gold2, vangtai: gold2 } })
                    chonkqqq = "Lẻ - Tài"
                }
                else if (value == 3) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangle: gold2, vangxiu: gold2 } })
                    chonkqqq = "Lẻ - Xỉu"
                }
            }
            const mess2 = "<br>Bạn đã chọn <strong style=\"color:red\">" + chonkqqq + "</strong>," + '<a href="javascript:void(0)" onclick="cancel(\'' + savecuoc._id + '\')"> Bấm vào đây để hủy đặt lại</a>'
            return res.send({ error: 0, message: "Đặt cược thành công cùng chờ kết quả nào!" + (chonkqqq == "" ? "" : mess2) });
        }
    }
})
var arrHoanvang = []
autoHoanCsmm = async () => {
    try {
        if (arrHoanvang.length > 0) {
            var temppp = arrHoanvang[0]
            //console.log(arrHoanvang)
            try {

                arrHoanvang.splice(0, 1);
                var refund = await Cuoc.findOne({ _id: temppp.idcuoc, status: 6 })

                if (refund) {

                    const updateHoan = await Cuoc.findOneAndUpdate({ _id: temppp.idcuoc, status: 6 }, { status: 5 },{new:true})
                    if (updateHoan) {
                        await updateCuocCsmmRedisId(updateHoan)

                        const user = await UserControl.upMoney(temppp.uid, temppp.vangdat);
                        if (user) {
                            const hanmucup = await UserControl.upHanmuc(temppp.uid, -temppp.vangdat, user.server)
                            const thanhtich = await UserControl.upThanhtich(user._id, -temppp.vangdat)

                            const sodu = await UserControl.sodu(temppp.uid, "Hoàn tiền con số may mắn", "+" + numberWithCommas(temppp.vangdat))

                            //nohuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu cancel
                            var nohu = await Nohu.findOne()
                            if (nohu) {
                                var nowpart = nohu.nowpart
                                var foundIndex = nowpart.findIndex(x => x.uid.toString() == user._id.toString());
                                var vangpercent = Number(Math.round(temppp.vangdat) - (Math.round(temppp.vangdat) * 95 / 100))
                                if (foundIndex != -1) {
                                    nowpart[foundIndex].vang -= Math.round(vangpercent);
                                }
                                await Nohu.findOneAndUpdate({}, { nowpart: nowpart, $inc: { vanghu: -Math.round(vangpercent) } })
                            }
                            //nohuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu cancel
                        }
                    }
                }
            } catch { }

        }
    } catch { }
    setTimeout(() => {
        autoHoanCsmm()
    }, 3500);
}
autoHoanCsmm()

router.post("/cancel", checklogin, async (req, res) => {
    if (!req.user.isLogin) {
        return res.send({ error: 1, message: "<strong>Thất bại! </strong> Vui lòng đăng nhập" });
    }
    const id = req.body.id
    const cuoc = await Cuoc.findOne({ _id: id, status: -1 })
    if (cuoc) {
        const phien = await Game.findById(cuoc.phien)
        if (phien.time > 10) {
            if (cuoc.type == 2) {
                return res.send({ error: 1, message: "<strong>Thất bại! </strong>Chức năng hủy không hỗ trợ phần này!" })
            }
            const refund = await Cuoc.findOneAndUpdate({ _id: id, status: -1 }, { status: 6, ketqua: 0, vangnhan: 0 })
            if (refund.uid.toString() != req.user._id.toString()) {
                return res.send({ error: 1, message: "<strong>Thất bại! </strong>Có lỗi đã xảy ra." })
            }
            if (refund) {
                arrHoanvang.push({ idcuoc: refund._id, uid: refund.uid, vangdat: refund.vangdat })
                return res.send({ error: 0, message: "<strong>Thành công! </strong>Lần sau vui lòng đặt cẩn thận hơn nha!." })
            }
        }
        else {
            return res.send({ error: 1, message: "<strong>Thất bại! </strong>Vui lòng hủy trước 10s trước lúc có kết quả!." })
        }
        //console.log(phien)
    }
    else {
        return res.send({ error: 1, message: "<strong>Thất bại! </strong>Có lỗi đã xảy ra." })
    }
})

router.get("/", (req, res) => {
    res.send("chao ban")
})
module.exports = router