const User = require('../models/User')
const Ipblock = require('../models/Ipblock')
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports = async function (req, res, next) {
  if (req.session && req.session.userId) {
    const iprequest = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    let isLogin = false;
    const user = await User.findOne({ _id: req.session.userId })
    if (user) {
      if ((!user.tenhienthi || user.tenhienthi == null || user.tenhienthi == "") && !req.url.includes("setname")) {
        return res.redirect("/user/setname")
      }
      isLogin = true;
      if (!req.session.pass || req.session.pass == undefined || req.session.pass == null) {
        req.session.pass = user.password
      }
      else if (req.session.pass != user.password) {
        req.session.destroy()
        req.user = { isLogin: false }
        return next();
      }
      const checkIp = await Ipblock.findOne({ ip: iprequest })
      if (checkIp) {
        return res.send("tam biet")
      }
      if (user.IP != iprequest) {
        await User.findOneAndUpdate({ _id: req.session.userId }, { IP: iprequest })
      }
      req.user = { hanmuc: user.hanmuc, thanhtichngay: user.thanhtichngay, sdt: user.sdt, topup: user.topup, clan: user.clan, server: user.server, _id: user._id, name: user.username, avatar: user.avatar, kimcuong: user.kimcuong, vang: numberWithCommas(Math.round(user.vang)), isLogin: isLogin, tenhienthi: user.tenhienthi }
    }
    else {
      req.user = { isLogin: false }
    }
    return next();
  } else {
    req.user = { isLogin: false }
    return next();
  }
}