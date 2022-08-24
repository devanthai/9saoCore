const router = require('express').Router()
const Rutvang = require('../../../models/Rutvang')
const Botrut = require('../../../models/Botrut')

// router.get('/', async (req, res) => {
//     if (req.query.action == "get") {
//         const tnv = req.query.tnv
//         const server = req.query.server
//         const rutvangg = await Rutvang.findOne({ server: server, tnv: tnv, status: 0 })
//         if (rutvangg) {
//             return res.send(rutvangg._id + "|" + rutvangg.sovang)
//         }
//         else {
//             return res.send("khongco")
//         }
//     }
//     else if (req.query.action == "done") {
//         const tnv = req.query.tnv
//         const id = req.query.id
//         const truocgd = req.query.truocgd
//         const saugd = req.query.saugd
//         try {
//             const lsvang = await Rutvang.findOneAndUpdate({ _id: id, status: 0 }, { status: 1, botgd: tnv, truocgd: truocgd, saugd: saugd })
//             if (lsvang) {
//                 return res.send("thanhcong")
//             }
//             else {
//                 return res.send("thatbai")
//             }
//         } catch {return res.send("thanhcong") }
//     }
//     else if (req.query.action == "info") {
//         const map = req.query.map
//         const server = req.query.server
//         const khu = req.query.khu
//         const tnv = req.query.tnv
//         const sovang = req.query.sovang
//         const taikhoan = req.query.taikhoan
//         if (map && server && khu && tnv && sovang && taikhoan) {
//             const botnap = await Botrut.findOneAndUpdate({ tnv: tnv, server: server, taikhoan: taikhoan }, { tnv: tnv, server: server, taikhoan: taikhoan, khu: khu, map: map, sovang: sovang })
//             if (!botnap) {
//                 const cc = await new Botrut({ tnv: tnv, server: server, taikhoan: taikhoan, khu: khu, map: map, sovang: sovang }).save()
//                 //console.log(cc)
//             }
//             return res.send("update")
//         }
//     }
//     return res.send("update")
// })
module.exports = router
