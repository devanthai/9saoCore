const router = require('express').Router()
const User = require('../../../models/User')
const userControl = require('../../../controller/user')
const Botnap = require('../../../models/Botnap')
const Napvang = require('../../../models/Napvang')
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// router.get('/', async (req, res) => {
//     if (req.query.action == "get") {
//         const tnv = req.query.tnv
//         const server = req.query.server
//         const lsvang = await Napvang.findOne({ server: server, status: 0, tnv: tnv })
//         if (lsvang) {
//             return res.send(lsvang._id + "|" + lsvang.sovang + "|" + lsvang.uid)
//         }
//         else return res.send("khongco")
//     }
//     else if (req.query.action == "done") {
//         const id = req.query.id
//         const tnv = req.query.tnv
//         const truocgd = req.query.truocgd
//         const saugd = req.query.saugd
//         try {
//             const lsvang = await Napvang.findOneAndUpdate({ _id: id, status: 0 }, { status: 1, botgd: tnv, truocgd: truocgd, saugd: saugd })
//             if (lsvang) {

//                 const user = await userControl.upMoney(lsvang.uid, lsvang.sovang)
//                 if (user) {
//                     const sodu = await userControl.sodu(lsvang.uid, "+" + numberWithCommas(lsvang.sovang), "Nạp vàng")
//                     return res.send("thanhcong")
//                 }
//             }
//             else {
//                 return res.send("thatbai")
//             }
//         } catch {return res.send("thatbai") }

//     }
//     else if (req.query.action == "info") {
//         const map = req.query.map
//         const server = req.query.server
//         const khu = req.query.khu
//         const tnv = req.query.tnv
//         const sovang = req.query.sovang
//         const taikhoan = req.query.taikhoan
//         if (map && server && khu && tnv && sovang && taikhoan) {
//             const botnap = await Botnap.findOneAndUpdate({ tnv: tnv, server: server, taikhoan: taikhoan }, { tnv: tnv, server: server, taikhoan: taikhoan, khu: khu, map: map, sovang: sovang })
//             if (!botnap) {
//                 const cc = await new Botnap({ tnv: tnv, server: server, taikhoan: taikhoan, khu: khu, map: map, sovang: sovang }).save()
//                // console.log(cc)
//             }
//             return res.send("update")
//         }
//     }
//     res.send("error")
// })
module.exports = router
