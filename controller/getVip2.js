const Momo = require('../models/Momo')
const Bank = require('../models/Bank')
const Tsr = require('../models/Tsr')
const The9sao = require('../models/The9sao')
const Card = require('../models/Card')

const ObjectId = require('mongoose').Types.ObjectId;
const { sort } = require("fast-sort")
function timeSince(date) {
    const time = date - new Date()
    let seconds = Math.floor(time / 1000);
    let days = Math.floor(seconds / 86400);
    let hours = Math.floor((seconds - (days * 86400)) / 60 / 60);
    let min = Math.floor(((seconds - (days * 86400)) - (hours * 3600)) / 60);
    let sec = Math.floor(((seconds - (days * 86400)) - (hours * 3600) - (min * 60)));
    return { day: days, since: getTimeSinceString(days, hours, min, sec) }
}
function timeSince2(now, todate) {
    const time = todate - now
    let seconds = Math.floor(time / 1000);
    let days = Math.floor(seconds / 86400);
    let hours = Math.floor((seconds - (days * 86400)) / 60 / 60);
    let min = Math.floor(((seconds - (days * 86400)) - (hours * 3600)) / 60);
    let sec = Math.floor(((seconds - (days * 86400)) - (hours * 3600) - (min * 60)));
    return { day: days, since: getTimeSinceString(days, hours, min, sec) }

}
const getTimeSinceString = (d, h, m, s) => {
    let str = ""
    if (d > 0) str += d + " ngày "
    if (h > 0) str += h + " giờ "
    if (m > 0) str += m + " phút "
    if (s > 0) str += s + " giây "
    return str
}
const vipGetValue = (topup) => {
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

const getVipGift = (vip) => {

    let phanthuong = 0
    if (vip == 1) {
        phanthuong = 2000000
    }
    else if (vip == 2) {
        phanthuong = 7000000 * 2
    }
    else if (vip == 3) {
        phanthuong = 35000000 * 2
    }
    else if (vip == 4) {
        phanthuong = 100000000 * 2
    }
    else if (vip == 5) {
        phanthuong = 225000000 * 2
    }
    else if (vip == 6) {
        phanthuong = 500000000 * 2
    }
    else if (vip == 7) {
        phanthuong = 2000000000 * 2
    }
    else if (vip == 8) {
        phanthuong = 5000000000 * 2
    }
    return { vip: vip, gift: phanthuong }
}

async function getVip(uidz) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    const banks = await Bank.find({ time: { $gte: startOfToday }, uid: new ObjectId(uidz), isRemoveVip: { $ne: true } })
    const momos = await Momo.find({ time: { $gte: startOfToday }, uid: new ObjectId(uidz), isRemoveVip: { $ne: true } })
    const tsrs = await Tsr.find({ time: { $gte: startOfToday }, uid: new ObjectId(uidz), isRemoveVip: { $ne: true } })
    const the9saos = await The9sao.find({ time: { $gte: startOfToday }, uid: new ObjectId(uidz), isRemoveVip: { $ne: true } })
    const cards = await Card.find({ time: { $gte: startOfToday }, status: 1, uid: new ObjectId(uidz), isRemoveVip: { $ne: true } })
    let array = [...banks, ...momos, ...tsrs, ...the9saos, ...cards]
    const hisalls = array.map((item) => { return { money: (item.sotien ? item.sotien : item.menhgia), time: new Date(item.time).getTime() } })
    const sorted = sort(hisalls).asc([h => h.time]);
    let totalMoney = sorted.reduce((accumulator, object) => { return accumulator + object.money; }, 0);
    const totalfirt = totalMoney
    const vipFirt = vipGetValue(totalMoney)
    let listVipDates = []
    let phanThuongTotal = 0
    for (const item of sorted) {
        let date = new Date(item.time)
        let time30day = date.setDate(date.getDate() + 30)
        let vipA = vipGetValue(totalMoney)
        let timesince = (listVipDates.length == 0 ? timeSince(time30day) : timeSince2(listVipDates[listVipDates.length - 1].timeCreate, item.time))
        totalMoney -= item.money
        if (vipA != vipGetValue(totalMoney)) {
            let giftz = getVipGift(vipA).gift * (timesince.day == 0 ? 1 : timesince.day)
            phanThuongTotal += giftz
            listVipDates.push({ vip: vipA, time: timesince, timeCreate: item.time, gift: giftz })
        }
    }
    return { totalMoney: totalfirt, vip: vipFirt, list: listVipDates, phanThuongTotal }
}
module.exports = getVip