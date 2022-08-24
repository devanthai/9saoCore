const schemaUser = require("../models/User");
const Sodu = require("../models/Sodu");
const Clan = require("../models/Clan");
const Setting = require('../models/Setting')


class User {

    async upMoney(uid, money) {
        return await schemaUser.findOneAndUpdate({ _id: uid }, { $inc: { vang: money } }, { new: true })
    }
    async topup(uid, money) {
        return await schemaUser.findOneAndUpdate({ _id: uid }, { $inc: { topup: money } }, { new: true })
    }
    async upKimcuong(uid, kimcuong) {
        return await schemaUser.findOneAndUpdate({ _id: uid }, { $inc: { kimcuong: kimcuong } }, { new: true })
    }
    async upHanmuc(uid, hanmuc, server) {
        var sucvat = "server" + server
        var setting = await Setting.findOne({ setting: "setting" })

        var ishanmuc = setting.hanmuc[sucvat]
        hanmuc = hanmuc * 2
        var issss = []
        if (ishanmuc) {
            issss = await schemaUser.findOneAndUpdate({ _id: uid }, { $inc: { hanmuc: hanmuc } }, { new: true })
        }
        return issss
    }
    async upThanhtich(uid, diem) {
        //console.log("up "+diem)
        const upThanhtichday = await schemaUser.findOneAndUpdate({ _id: uid }, { $inc: { thanhtichngay: diem } })

        if (upThanhtichday.clan != 0) {
            const us = await schemaUser.findOneAndUpdate({ _id: uid }, { $inc: { "clan.thanhtich": diem, "clan.thanhtichngay": diem } })
            //  const uss = await schemaUser.findOneAndUpdate({ _id: uid }, { $inc: {  } })


            const clan = await Clan.findOneAndUpdate({ _id: us.clan.id }, { $inc: { thanhtich: diem } }, { new: true })
        }
        return upThanhtichday
    }
    async sodu(uid, giaodich, noidung) {
        const user = await schemaUser.findOne({ _id: uid })
        if(user)
        {
            const newSodu =await new Sodu({ noidung: noidung, giaodich: giaodich, uid: user._id, vang: Math.round(user.vang) }).save()
        }
       return user
    }
}
module.exports = new User

