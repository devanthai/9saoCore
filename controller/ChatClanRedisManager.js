const redisClient = require("../redisCache")
const keyMessageClan = "clanMessagesSS"
const { v4: uuidv4 } = require('uuid');

getMessageClanRedis = async (idClan) => {
    const keyclan = keyMessageClan + idClan
    const mess = await redisClient.get(keyclan)
    if (!mess) {
        return { countMess: 1, mess: [] }
    }
    else {
        return JSON.parse(mess)
    }
}

addMessageClanRedis = async (idClan, message) => {
    const keyclan = keyMessageClan + idClan

    const mess = await redisClient.get(keyclan)
    if (!mess) {
        const messz = { countMess: 1, mess: [message] }
        await redisClient.set(keyclan, JSON.stringify(messz))
        return messz
    }
    else {
        let messs = JSON.parse(mess)
        messs.countMess++
        messs.mess.unshift(message)
        if (messs.mess.length > 20) {
            messs.mess.pop();
        }
        await redisClient.set(keyclan, JSON.stringify(messs))
        return messs
    }
}

deleteMessIdRedis = async (idClan, id) => {
    const keyclan = keyMessageClan + idClan
    const mess = await redisClient.get(keyclan)
    if (mess) {
        let messs = JSON.parse(mess)
        messs.mess = messs.mess.filter(x => x._id != id)
        await redisClient.set(keyclan, JSON.stringify(messs))
    }
}

getMess = (noidung, type, admin, name, sodu, uidclan) => {
    return { _id: uuidv4(), noidung, type, admin, name, sodu, uidclan, time: new Date().getTime() }
}
module.exports = { getMessageClanRedis, addMessageClanRedis, deleteMessIdRedis, getMess }