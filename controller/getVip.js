const Momo = require('../models/Momo')
const Bank = require('../models/Bank')
const Tsr = require('../models/Tsr')
const The9sao = require('../models/The9sao')
const Card = require('../models/Card')

const ObjectId = require('mongoose').Types.ObjectId;

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
  let totalMoney = hisalls.reduce((accumulator, object) => { return accumulator + object.money; }, 0);
  return totalMoney
}
module.exports = getVip