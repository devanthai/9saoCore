const Momo = require('../models/Momo')
const Bank = require('../models/Bank')
const Tsr = require('../models/Tsr')
const The9sao = require('../models/The9sao')
const Card = require('../models/Card')

const ObjectId = require('mongoose').Types.ObjectId;
const { sort } = require("fast-sort")
function timeSince(date) {
    const time = date - new Date()
    var seconds = Math.floor(time / 1000);
    let days = Math.floor(seconds / 86400);
    let hours = Math.floor((seconds - (days * 86400)) / 60 / 60);
    let min = Math.floor(((seconds - (days * 86400)) - (hours * 3600)) / 60);
    let sec = Math.floor(((seconds - (days * 86400)) - (hours * 3600) - (min * 60)));
    return { day: null, since: getTimeSinceString(days, hours, min, sec) }
}
function timeSince2(now, todate) {
    const time = todate - now
    var seconds = Math.floor(time / 1000);
    let days = Math.floor(seconds / 86400);
    let hours = Math.floor((seconds - (days * 86400)) / 60 / 60);
    let min = Math.floor(((seconds - (days * 86400)) - (hours * 3600)) / 60);
    let sec = Math.floor(((seconds - (days * 86400)) - (hours * 3600) - (min * 60)));
    return { day: null, since: getTimeSinceString(days, hours, min, sec) }
}
getTimeSinceString = (d, h, m, s) => {
    let str = ""
    if (d > 0) str += d + " ngày "
    if (h > 0) str += h + " giờ "
    if (m > 0) str += m + " phút "
    if (s > 0) str += s + " giây "
    return str
}
vipGetValue = (topup) => {
    let vipp = 0
    if (topup >= 100000) {
        vipp = 1;
    }
    if (topup >= 500000) {
        vipp = 2;
    }
    if (topup >= 2000000) {
        vipp = 3;
    }
    if (topup >= 5000000) {
        vipp = 4;
    }
    if (topup >= 10000000) {
        vipp = 5;
    }
    if (topup >= 20000000) {
        vipp = 6;
    }
    if (topup >= 50000000) {
        vipp = 7;
    }
    if (topup >= 100000000) {
        vipp = 8;
    }
    return vipp
}

async function getVip(uidz) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    const banks = await Bank.find({ time: { $gte: startOfToday }, uid: new ObjectId(uidz) })
    const momos = await Momo.find({ time: { $gte: startOfToday }, uid: new ObjectId(uidz) })
    const tsrs = await Tsr.find({ time: { $gte: startOfToday }, uid: new ObjectId(uidz) })
    const the9saos = await The9sao.find({ time: { $gte: startOfToday }, uid: new ObjectId(uidz) })
    const cards = await Card.find({ time: { $gte: startOfToday }, status: 1, uid: new ObjectId(uidz) })
    let array = [...banks, ...momos, ...tsrs, ...the9saos, ...cards]
    const hisalls = array.map((item) => { return (item = { money: (item.sotien ? item.sotien : item.menhgia), time: new Date(item.time).getTime() }) })
    const sorted = sort(hisalls).asc([h => h.time]);
    let totalMoney = sorted.reduce((accumulator, object) => { return accumulator + object.money; }, 0); //2000
    const totalfirt = totalMoney
    const vipFirt = vipGetValue(totalMoney)
    let vipNow = vipGetValue(totalMoney) //3
    let listVipDates = []
    for (let i = 0; i < sorted.length; i++) {
        let item = sorted[i]
        let date = new Date(item.time)
        let time30day = date.setDate(date.getDate() + 30)
        let vipA = vipGetValue(totalMoney) //3
        let timesince = (listVipDates.length == 0 ? timeSince(time30day) : timeSince2(sorted[i - 1].time, item.time))
        totalMoney -= item.money //-500 = 1500
        vipNow = vipGetValue(totalMoney)//2
        if (vipA != vipNow) listVipDates.push({ vip: vipA, time: timesince }) //3->2 true -> add
    }
    return { totalMoney: totalfirt, vip: vipFirt, list: listVipDates }
}
module.exports = getVip