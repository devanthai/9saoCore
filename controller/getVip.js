const Momo = require('../models/Momo')
const Bank = require('../models/Bank')
const Tsr = require('../models/Tsr')
const The9sao = require('../models/The9sao')
const Gt1s = require('../models/Gt1s')
const Card = require('../models/Card')

const ObjectId = require('mongoose').Types.ObjectId;

const keyGetVipRedis = "keygetvip2"


const client = require("../redisCache")

const getvip2 = require("./getVip2")


async function getVipRedis(uidz) {
  const getvip = await client.get(keyGetVipRedis)
  let tiencard = 0;
  let tienmomo = 0;
  let tientsr = 0;
  let tienbank = 0;
  let tiengt1s = 0;
  let tienthe9sao = 0
  let total = 0
  console.log(getvip)
  if (!getvip) {
    await client.set(keyGetVipRedis, JSON.stringify({}))
    return 0
  }
  else {
    let vipJ = JSON.parse(getvip)
    if (!vipJ[uidz]) {
      let now = new Date();
      let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      try {
        const sum111 = await Bank.aggregate([{
          $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
        }, {
          $group: {
            _id: null,
            sotien: {
              $sum: "$sotien"
            },
          }
        }])
        if (sum111) {
          tienbank = sum111[0].sotien;
        }
      } catch { }
      try {
        const sum111 = await Momo.aggregate([{
          $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
        }, {
          $group: {
            _id: null,
            sotien: {
              $sum: "$sotien"
            },
          }
        }])
        if (sum111) {
          tienmomo = sum111[0].sotien;
        }

      } catch { }
      try {
        const sum111 = await Gt1s.aggregate([{
          $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
        }, {
          $group: {
            _id: null,
            sotien: {
              $sum: "$sotien"
            },
          }
        }])
        if (sum111) {
          tiengt1s = sum111[0].sotien;
        }

      } catch { }
      try {
        const sumz = await Tsr.aggregate([{
          $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
        }, {
          $group: {
            _id: null,
            sotien: {
              $sum: "$sotien"
            },

          }
        }])

        if (sumz) {
          tientsr = sumz[0].sotien
        }
      } catch { }
      try {
        const sumz = await The9sao.aggregate([{
          $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
        }, {
          $group: {
            _id: null,
            sotien: {
              $sum: "$sotien"
            },

          }
        }])

        if (sumz) {
          tienthe9sao = sumz[0].sotien
        }
      } catch { }
      try {
        const sumc = await Card.aggregate([{
          $match: { time: { $gte: startOfToday }, status: 1, uid: new ObjectId(uidz) },
        }, {
          $group: {
            _id: null,
            tongcard: {
              $sum: "$menhgia"
            },
            tongreal: {
              $sum: "$amount"
            }
          }
        }])
        if (sumc) {
          tiencard = sumc[0].tongcard
        }
      } catch { }
      total = tiencard + tienmomo + tientsr + tiengt1s + tienbank + tienthe9sao
      vipJ[uidz] = total
      await client.set(keyGetVipRedis, JSON.stringify(vipJ))
      return total
    }
    else {
      return vipJ[uidz]
    }
  }
}




async function getVip(uidz) {
  await getvip2(uidz)
  let tiencard = 0;
  let tienmomo = 0;
  let tientsr = 0;
  let tienbank = 0;
  let tiengt1s = 0;
  let tienthe9sao = 0
  let total = 0
  let now = new Date();
  let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  try {
    const sum111 = await Bank.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },
      }
    }])
    if (sum111) {
      tienbank = sum111[0].sotien;
    }
  } catch { }
  try {
    const sum111 = await Momo.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },
      }
    }])
    if (sum111) {
      tienmomo = sum111[0].sotien;
    }

  } catch { }
  try {
    const sum111 = await Gt1s.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },
      }
    }])
    if (sum111) {
      tiengt1s = sum111[0].sotien;
    }

  } catch { }
  try {
    const sumz = await Tsr.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },

      }
    }])

    if (sumz) {
      tientsr = sumz[0].sotien
    }
  } catch { }
  try {
    const sumz = await The9sao.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },

      }
    }])

    if (sumz) {
      tienthe9sao = sumz[0].sotien
    }
  } catch { }
  try {
    const sumc = await Card.aggregate([{
      $match: { time: { $gte: startOfToday }, status: 1, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        tongcard: {
          $sum: "$menhgia"
        },
        tongreal: {
          $sum: "$amount"
        }
      }
    }])
    if (sumc) {
      tiencard = sumc[0].tongcard
    }
  } catch { }
  total = tiencard + tienmomo + tientsr + tiengt1s + tienbank + tienthe9sao
  console.log(total)
  return total
}
module.exports = getVip