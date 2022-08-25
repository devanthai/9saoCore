const Gamez = require('../models/Game')
const Setting = require('../models/Setting')
const Cuoc = require('../models/Cuoc')
const Chat = require('../models/Chat')
const Clan = require('../models/Clan')
const Momo = require('../models/Momo')
const Bank = require('../models/Bank')
const Tsr = require('../models/Tsr')
const Gt1s = require('../models/Gt1s')
const Card = require('../models/Card')
const User = require('../models/User')
const Gifcode = require('../models/Gifcode')
const userControl = require('../controller/user')
var ObjectId = require('mongoose').Types.ObjectId;
const Nohu = require('../models/nohu/Nohu')
const PlayerSocket = require('../games/PlayerSocket')
const The9sao = require('../models/The9sao')

const { getCuocCsmmUserRedis, getCuocCsmmRedis, updateCuocCsmmRedisId, addCuocCsmmRedis } = require("./CuocCsmmRedisManager")



const moment = require('moment')

const fs = require('fs');
function Isjson(json) {
  try {
    JSON.parse(json)
  }
  catch {
    return false
  }
  return true;

}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var kqs = [
  { server: 1, kq: Math.round(getRandomIntInclusive(0, 99)) },
  { server: 2, kq: Math.round(getRandomIntInclusive(0, 99)) },
  { server: 3, kq: Math.round(getRandomIntInclusive(0, 99)) },
  { server: 4, kq: Math.round(getRandomIntInclusive(0, 99)) },
  { server: 5, kq: Math.round(getRandomIntInclusive(0, 99)) },
  { server: 6, kq: Math.round(getRandomIntInclusive(0, 99)) },
  { server: 7, kq: Math.round(getRandomIntInclusive(0, 99)) },
  { server: 8, kq: Math.round(getRandomIntInclusive(0, 99)) },
  { server: 9, kq: Math.round(getRandomIntInclusive(0, 99)) },
  { server: 10, kq: Math.round(getRandomIntInclusive(0, 99)) }
]



var ketquasv1 = -1;
var ketquasv2 = -1;
var ketquasv3 = -1;
var ketquasv4 = -1;
var ketquasv5 = -1;
var ketquasv6 = -1;
var ketquasv7 = -1;
var ketquasv8 = -1;
var ketquasv9 = -1;
var ketquasv10 = -1;

var timeGame = 20;
var time = timeGame;
var timecsmm = "24/24"
var timewait = false;

function getStatus(kq, type, value) {

  const xiu = kq < 50
  const tai = kq >= 50
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
  else
    if (type == 2) {
      if (kq == value) { return 1 }
      else { return 2 }
    }
}

var isRunsv1 = false
var isRunsv2 = false
var isRunsv3 = false
var isRunsv4 = false
var isRunsv5 = false
var isRunsv6 = false
var isRunsv7 = false
var isRunsv8 = false
var isRunsv9 = false
var isRunsv10 = false

function SetRunFalse(server) {

  if (server == 1) isRunsv1 = false
  if (server == 2) isRunsv2 = false
  if (server == 3) isRunsv3 = false
  if (server == 4) isRunsv4 = false
  if (server == 5) isRunsv5 = false
  if (server == 6) isRunsv6 = false
  if (server == 7) isRunsv7 = false
  if (server == 8) isRunsv8 = false
  if (server == 9) isRunsv9 = false
  if (server == 10) isRunsv10 = false
}
function SetRunTrue(server) {
  if (server == 1) isRunsv1 = true
  if (server == 2) isRunsv2 = true
  if (server == 3) isRunsv3 = true
  if (server == 4) isRunsv4 = true
  if (server == 5) isRunsv5 = true
  if (server == 6) isRunsv6 = true
  if (server == 7) isRunsv7 = true
  if (server == 8) isRunsv8 = true
  if (server == 9) isRunsv9 = true
  if (server == 10) isRunsv10 = true
}
function CheckRun(server) {
  if (server == 1 && isRunsv1) return true
  if (server == 2 && isRunsv2) return true
  if (server == 3 && isRunsv3) return true
  if (server == 4 && isRunsv4) return true
  if (server == 5 && isRunsv5) return true
  if (server == 6 && isRunsv6) return true
  if (server == 7 && isRunsv7) return true
  if (server == 8 && isRunsv8) return true
  if (server == 9 && isRunsv9) return true;
  if (server == 10 && isRunsv10) return true;

  return false
}
async function chayGame(server, io) {
  if (!CheckRun(server)) {
    SetRunTrue(server)
    try {
      var ccc = server
      var ketquazz = kqs.find(({ server }) => server === ccc).kq
      const phienChay = await Gamez.findOne({ server: server, status: 0 }).sort({ $natural: -1 })
      if (!phienChay) {
        const game = new Gamez({ server: server, ketquatruoc: ketquazz, time: time, timeCsmm: timecsmm })
        try {
          const savedgame = await game.save()
        }
        catch (err) { }
      }
      else if (time > phienChay.time) {
        let game = await Gamez.findByIdAndUpdate(phienChay._id, { status: 1, ketqua: ketquazz });
        let cuocs = await Cuoc.find({ status: -1, server: server })
        try {
          io.sockets.emit("CHAT", JSON.stringify({ "typechat": "2", "server": server, "type": "BOT", "name": "Hệ thống", "noidung": " Kết quả con số may mắn: " + ketquazz }))
          io.sockets.emit("CHAT", JSON.stringify({ "typechat": "2", "server": server, "type": "BOT", "name": "Hệ thống", "noidung": " Chúc mừng các bạn đặt cược " + (ketquazz % 2 == 0 ? "Chẵn" : "Lẻ") + " và " + (ketquazz >= 50 ? "Tài" : "Xỉu") }))
        } catch { }
        const setting = await Setting.findOne({ setting: "setting" })
        var countgame = await Gamez.countDocuments({ server: server })
        if (countgame > 100) {

          Gamez.find({ server: server }).select('_id').sort({ _id: 1 }).limit(countgame - 10).exec((err, docs) => {
            const ids = docs.map((doc) => doc._id);
            Gamez.deleteMany({ _id: { $in: ids } }, (err) => { });
            console.log("delete")
          });
        }
        // cuocs.forEach(async (cuoc) => {

        for (let cuoc of cuocs) {

          if (cuoc.phien == phienChay._id) {
            const status = getStatus(Math.round(ketquazz), cuoc.type, cuoc.chon);
            var vangnhan = 0;
            if (status == 1) {
              if (cuoc.type == 0) {
                vangnhan = cuoc.vangdat * setting.tile.cltx
              }
              else if (cuoc.type == 4) {
                vangnhan = cuoc.vangdat * setting.tile.xien
              }
              else if (cuoc.type == 2) {
                vangnhan = cuoc.vangdat * setting.tile.dudoankq
              }

              await userControl.upMoney(cuoc.uid, vangnhan)
              await userControl.sodu(cuoc.uid, "Thắng con số may mắn", "+" + numberWithCommas(vangnhan))
              if (vangnhan > 50000000) {
                try {
                  io.sockets.emit("CHAT", JSON.stringify({ "typechat": "2", "server": cuoc.server, "type": "BOT", "name": "Hệ thống", "noidung": cuoc.nhanvat + " vừa thắng " + numberWithCommas((vangnhan)) + " vàng" }))
                } catch { }
              }
            }
            else {
              var user = await userControl.upMoney(cuoc.uid, 0)
              await userControl.upHanmuc(cuoc.uid, cuoc.vangdat * -1, user.server)
            }
            const cuocccc = await Cuoc.findOneAndUpdate({ _id: cuoc._id }, { status: status, ketqua: ketquazz, vangnhan: vangnhan }, { new: true });
            await updateCuocCsmmRedisId(cuocccc)
          }
          else {

            await userControl.upMoney(cuoc.uid, cuoc.vangdat)
            await userControl.sodu(cuoc.uid, "Hoàn tiền con số may mắn ", "+" + numberWithCommas(Math.round(cuoc.vangdat)))
            const cuocccc = await Cuoc.findOneAndUpdate({ _id: cuoc._id }, { status: 2, ketqua: 0, vangnhan: 0 }, { new: true });
            await updateCuocCsmmRedisId(cuocccc)

          }
        }//)

        

        const Newgame = new Gamez({ server: server, ketquatruoc: ketquazz, time: time, timeCsmm: timecsmm })
        try {

          const savedgame = await Newgame.save()
        }
        catch (err) { }
      }
      else {
        let updateTime = await Gamez.findByIdAndUpdate(phienChay._id, { time: time });
      }
    } catch { }
    SetRunFalse(server)
  }
}
var CountHackPlayer = 0;

class Game {
  getCountHackPlayer() {
    return CountHackPlayer;
  }
  setCountHackPlayer(count) {
    CountHackPlayer = count
    return CountHackPlayer;
  }
  getTime() {
    return time;
  }


  async getTopClan() {
    const topclans = await Clan.find({}).sort({ thanhtich: -1 }).limit(10)
    const checkUserClan = await User.find({ "clan": { "$ne": 0 } })



    var strclan = "";
    var indexTop = 1;
    topclans.forEach(element => {

      var giaithuong = "";
      if (indexTop == 1) giaithuong = "500 triệu / 1 thành viên"
      else if (indexTop == 2) giaithuong = "250 triệu / 1 thành viên"
      else if (indexTop == 3) giaithuong = "100 triệu / 1 thành viên"
      else if (indexTop == 4) giaithuong = "75 triệu / 1 thành viên"
      else if (indexTop == 5) giaithuong = "50 triệu / 1 thành viên"
      else if (indexTop == 6) giaithuong = "40 triệu / 1 thành viên"
      else if (indexTop == 7) giaithuong = "30 triệu / 1 thành viên"
      else if (indexTop == 8) giaithuong = "20 triệu / 1 thành viên"
      else if (indexTop == 9) giaithuong = "10 triệu / 1 thành viên"
      else giaithuong = "5 triệu / 1 thành viên"



      var countMem = checkUserClan.filter(x => x.clan.id == element._id.toString()).length

      strclan += '<tr id="top' + indexTop + '"> <td  style="padding: 0"><img src="images/clan/' + element.type + '.png" style=" max-width: 40px; height: auto; padding-top: 5px" ;="" padding:="" 0;="" margin-bottom:="" 10px"="" alt=""></td>  <td style="white-space:nowrap;">' + element.name + '</td> <td style="white-space:nowrap;">' + countMem + '/25</td> <td style="white-space:nowrap;"> ' + numberWithCommas(element.thanhtich) + '</td>  <td style="white-space:nowrap;">' + giaithuong + '</td>  </tr>'
      indexTop++
    })
    return strclan
  }

  async getBxh() {
    const topUser = await User.find({}).sort({ thanhtichngay: -1 }).limit(7)
    var strclan = "";
    var indexTop = 1;
    topUser.forEach(element => {
      var giai = '';

      if (indexTop == 1) giai = "10000tr vàng";
      else if (indexTop == 2) giai = "5000tr vàng"
      else if (indexTop == 3) giai = "3000tr vàng"
      else if (indexTop == 4) giai = "1000tr vàng"
      else if (indexTop == 5) giai = "500tr vàng"
      else if (indexTop == 6) giai = "300tr vàng"
      else giai = "100tr vàng"

      strclan += '<tr id="top' + indexTop + '"><td style="padding: 0"><img src="images/bxh/' + indexTop + '.gif" style=" max-width: 32px; height:auto; padding: 0" alt=""></td><td style="white-space:nowrap;">' + element.server + '</td><td style="white-space:nowrap;">' + element.tenhienthi + '</td><td style="white-space:nowrap;">' + numberWithCommas(element.thanhtichngay) + '</td><td style="white-space:nowrap;">' + giai + '</td></tr>'
      indexTop++
    })
    return strclan;
  }






  server24(io) {



    function makeid(length) {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
          charactersLength));
      }
      return result;
    }
    // setInterval(() => {
    //   try {
    //     io.sockets.emit("USERONLINE", PlayerSocket.SocketPlayer.length + Number(CountHackPlayer))
    //   } catch { }
    // }, 1000);
    // setInterval(async () => {
    //   try {
    //     var code1 = await new Gifcode({ code: makeid(6), phanthuong: Math.round(getRandomIntInclusive(1000000, 7000000)) }).save()
    //     var code2 = await new Gifcode({ code: makeid(6), phanthuong: Math.round(getRandomIntInclusive(1000000, 7000000)) }).save()
    //     var code3 = await new Gifcode({ code: makeid(6), phanthuong: Math.round(getRandomIntInclusive(1000000, 7000000)) }).save()
    //     var code4 = await new Gifcode({ code: makeid(6), phanthuong: Math.round(getRandomIntInclusive(1000000, 7000000)) }).save()
    //     var code5 = await new Gifcode({ code: makeid(6), phanthuong: Math.round(getRandomIntInclusive(1000000, 7000000)) }).save()
    //     var noidung = "<br>Nhập code: <strong>" + code1.code + "</strong> nhận ngay " + numberWithCommas(code1.phanthuong) + " vàng<br>" +
    //       "Nhập code: <strong>" + code2.code + "</strong> nhận ngay " + numberWithCommas(code2.phanthuong) + " vàng<br>" +
    //       "Nhập code: <strong>" + code3.code + "</strong> nhận ngay " + numberWithCommas(code3.phanthuong) + " vàng<br>" +
    //       "Nhập code: <strong>" + code4.code + "</strong> nhận ngay " + numberWithCommas(code4.phanthuong) + " vàng<br>" +
    //       "Nhập code: <strong>" + code5.code + "</strong> nhận ngay " + numberWithCommas(code5.phanthuong) + " vàng<br>"
    //     io.sockets.emit("CHAT", JSON.stringify({ "typechat": "1", "server": "10", "type": "BOT", "name": "ÔNG GIÀ NOEL", "noidung": noidung }))
    //   } catch { }
    // }, 1200000)

    // setInterval(() => {
    //   try {
    //     fs.readFile('gaixinh.txt', function (err, data) {
    //       if (err) { console.log("loi") }
    //       const arr = data.toString().replace(/\r\n/g, '\n').split('\n');
    //       var noidung = '<br><img src="' + arr[getRandomIntInclusive(0, arr.length)] + '" alt="9sao.me" width="75%" height="auto"><br>Chúc anh em kênh chat chơi game vui vẻ 💓💓💓'
    //       io.sockets.emit("CHAT", JSON.stringify({ "typechat": "1", "server": "10", "type": "BOT", "name": "👇👇👇", "noidung": noidung }))
    //     });
    //   } catch { }
    // }, 300000)


    async function Nohuuu() {
      console.log("Nổ hũ")
      var nohu = await Nohu.findOne()
      var vanghu = Math.round(Number(nohu.vanghu))
      console.log("Vàng hũ: " + vanghu)
      var nowpart = nohu.nowpart
      var vangnow = 0
      for (let i = 0; i < nowpart.length; i++) {
        vangnow += Math.round(Number(nowpart[i].vang))
      }
      console.log("Vàng phiên này: " + vangnow)
      var winer = []
      for (let i = 0; i < nowpart.length; i++) {
        if (Math.round(nowpart[i].vang) > 0) {
          try {
            var percent = Number(Math.round(nowpart[i].vang) * 100 / Math.round(Number(vangnow)))
            var vangan = Math.round(Number(vanghu * percent / 100))
            vangan = Math.round(vangan * 0.05)
            console.log("Vàng ăn: " + vangan)
            if (vangan < 0) {
              vangan = vangan * -1
            }
            await userControl.upMoney(new ObjectId(nowpart[i].uid), Number(vangan))
            await userControl.sodu(new ObjectId(nowpart[i].uid), "Bạn bị bom nổ", "+" + numberWithCommas(vangan))
            winer.push({ name: nowpart[i].name, vangthang: vangan })
          } catch { }
        }
      }
      await Nohu.findOneAndUpdate({}, { vanghu: 0, nowpart: [], lastwin: winer })
      console.log("XOng")
      //await Nohu.findOneAndUpdate({}, { nowpart: [] })
    }


    setInterval(async () => {
      const timeee = new Date()
      if (!timewait) {
        for (let i = 0; i < kqs.length; i++) {
          if (timeee.getHours() >= 8 && timeee.getHours() <= 20) {
            kqs[i].kq = Math.round(getRandomIntInclusive(0, 99))
          }
          else {
            kqs[i].kq = Math.round(getRandomIntInclusive(1, 98))
          }
        }
      }
    }, 5000)

    setInterval(async () => {
      if (time > 0) {
        time--
      }
      if (time <= 0 && !timewait) {
        timewait = true

        setTimeout(async () => {
          // kqs = [{ server: 1, kq: Math.round(getRandomIntInclusive(0, 99)) },
          // { server: 2, kq: Math.round(getRandomIntInclusive(0, 99)) },
          // { server: 3, kq: Math.round(getRandomIntInclusive(0, 99)) },
          // { server: 4, kq: Math.round(getRandomIntInclusive(0, 99)) },
          // { server: 5, kq: Math.round(getRandomIntInclusive(0, 99)) },
          // { server: 6, kq: Math.round(getRandomIntInclusive(0, 99)) },
          // { server: 7, kq: Math.round(getRandomIntInclusive(0, 99)) },
          // { server: 8, kq: Math.round(getRandomIntInclusive(0, 99)) },
          // { server: 9, kq: Math.round(getRandomIntInclusive(0, 99)) },
          // { server: 10, kq: Math.round(getRandomIntInclusive(0, 99)) }]


          kqs = [{ server: 1, kq: (ketquasv1 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv1) },
          { server: 2, kq: (ketquasv2 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv2) },
          { server: 3, kq: (ketquasv3 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv3) },
          { server: 4, kq: (ketquasv4 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv4) },
          { server: 5, kq: (ketquasv5 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv5) },
          { server: 6, kq: (ketquasv6 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv6) },
          { server: 7, kq: (ketquasv7 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv7) },
          { server: 8, kq: (ketquasv8 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv8) },
          { server: 9, kq: (ketquasv9 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv9) },
          { server: 10, kq: (ketquasv10 == -1 ? Math.round(getRandomIntInclusive(0, 99)) : ketquasv10) }
          ]



          time = timeGame
          timewait = false


          ketquasv1 = -1;
          ketquasv2 = -1;
          ketquasv3 = -1;
          ketquasv4 = -1;
          ketquasv5 = -1;
          ketquasv6 = -1;
          ketquasv7 = -1;
          ketquasv8 = -1;
          ketquasv9 = -1;
          ketquasv10 = -1;

          for (let i = 0; i < kqs.length; i++) {
            if ((kqs[i].kq == 99 || kqs[i].kq == 0) && kqs[i].server == 10) {
              await Nohuuu()
              break
            }
          }
          chayGame(10, io)
          chayGame(9, io)
          chayGame(8, io)
          chayGame(7, io)
          chayGame(6, io)
          chayGame(5, io)
          chayGame(4, io)
          chayGame(3, io)
          chayGame(2, io)
          chayGame(1, io)
          await Nohu.findOneAndUpdate({}, { nowpart: [] })
          // console.log("XOng2")


        }, 5000)

      }

    }, 1000)


    setInterval(() => {
      chayGame(10, io)
      chayGame(9, io)
      chayGame(8, io)
      chayGame(7, io)
      chayGame(6, io)
      chayGame(5, io)
      chayGame(4, io)
      chayGame(3, io)
      chayGame(2, io)
      chayGame(1, io)

    }, 5000)
  }
}
module.exports = new Game