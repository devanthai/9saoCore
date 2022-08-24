const request = require('request');
const Gamekeno = require('../models/Gamekeno')
const Cuockeno = require('../models/Cuockeno')
const userControl = require('../controller/user')
class Keno {

    KenoStart() {
        setInterval(() => {
            Chaygame()
        }, 8000)
        function Getkeno() {
            return new Promise(resolve => {
                try {
                    request.get('https://www.minhchinh.com/livekqxs/xstt/js/KN.js', function (error, response, body) {

                        if (error) {
                            return resolve(null)
                        }
                        try {
                            var rq = JSON.parse(body.split('=')[1])
                            if (rq) {
                                return resolve(rq)
                            }

                            else { return resolve(null) }
                        } catch { return resolve(null) }
                    })
                } catch { return resolve(null) }
            })
        }

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        function getStatus(kq, type, value) {

            const xiu = kq < 810
            const tai = kq >= 810
            const chan = kq % 2 == 0

            if (type == 0) {
                if ((chan && value == 0) || (!chan && value == 1) || (tai && value == 2) || (xiu && value == 3)) return 1;
                else return 2
            }
            else if (type == 4) {
                if ((chan && tai && value == 0) || (chan && xiu && value == 1) || (!chan && tai && value == 2) || (!chan && xiu && value == 3)) {
                    return 1;
                }
                else return 2
            }

        }
        function equar(a, b) {
            if (a.length !== b.length) {
                return false
            } else {
                for (let i = 0; i < a.length; i++) {
                    if (a[i] !== b[i]) {
                        return false
                    }
                }
                return true;
            }
        }
        async function Chaygame() {
            const kq = await Getkeno();
            // console.log(kq)
            if (kq != null) {
                if (kq.runtt == 1) {
                    if (kq.lastResult.total != undefined && kq.next_date != undefined && kq.lastResult != undefined && kq.live_date != undefined && kq.next_ky != undefined) {
                        const findKy = await Gamekeno.findOne({ 'game.live_ky': kq.live_ky })
                        if (!findKy) {
                            const checkPhien = await Gamekeno.findOne({ status: 0 }).sort({ 'date': -1 })
                            if (!checkPhien) {
                                const newky = await new Gamekeno({ game: kq }).save()
                            }
                            else if (checkPhien) {
                                var checkCCC = equar(checkPhien.game.lastResult.kq, kq.lastResult.kq);
                                if (!checkCCC) {
                                    const xongphientruoc = await Gamekeno.findByIdAndUpdate(checkPhien._id, { status: 1 })
                                    let cuocs = await Cuockeno.find({ status: -1 })
                                    for (let i = 0; i < cuocs.length; i++) {
                                        var cuoc = cuocs[i]

                                        if (cuoc.ky == checkPhien.game.next_ky) {

                                            const status = getStatus(Number(kq.lastResult.total), cuoc.type, cuoc.chon);
                                            var vangnhan = 0;
                                            if (status == 1) {
                                                if (cuoc.type == 0) {
                                                    vangnhan = cuoc.vangdat * 1.9
                                                }
                                                else if (cuoc.type == 4) {
                                                    vangnhan = cuoc.vangdat * 3.2
                                                }

                                                await userControl.upMoney(cuoc.uid, vangnhan)
                                                var user = await userControl.sodu(cuoc.uid, "Thắng con xổ số Keno", "+" + numberWithCommas(vangnhan))

                                                const hanmucup = await userControl.upHanmuc(user._id, cuoc.vangdat * 2, user.server)
                                            }
                                        
                                            await Cuockeno.findOneAndUpdate({ _id: cuoc._id }, { status: status, ketqua: Number(kq.lastResult.total), vangnhan: vangnhan });
                                        }
                                        else {

                                            await userControl.upMoney(cuoc.uid, cuoc.vangdat)
                                            await userControl.sodu(cuoc.uid, "Hoàn tiền xổ số Keno vì lỗi ", "+" + numberWithCommas(Math.round(cuoc.vangdat)))
                                            await Cuockeno.findOneAndUpdate({ _id: cuoc._id }, { status: 2, ketqua: 0, vangnhan: 0 });
                                        }
                                    }
                                    const newky = await new Gamekeno({ game: kq }).save()
                                }
                            }
                        }
                        else {
                            const kyyyy = await Gamekeno.findOneAndUpdate({ 'game.live_ky': kq.live_ky, status: 0 }, { game: kq })
                        }
                    }
                }
                if (kq.runtt == 0) {
                    const today = new Date()
                    const tomorrow = new Date(today)
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    tomorrow.setHours(6, 30, 0, 0)

                    const ccccsdg = await Gamekeno.findOneAndUpdate({ 'game.next_date': tomorrow.toLocaleString() }).sort({ 'date': -1 })
                }
            }
        }
    }
}
module.exports = new Keno
