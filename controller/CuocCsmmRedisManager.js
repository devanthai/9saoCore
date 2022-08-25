
const redisClient = require("../redisCache")
const keyCuocsRedis = "keyCuocscsmm"

addCuocCsmmRedis = async (cuoc) => {

    delete cuoc.bot
    const key = keyCuocsRedis + "Server" + cuoc.server
    const cuocs = await redisClient.get(key)
    if (!cuocs) {
        const cuocz = [cuoc]
        await redisClient.set(key, JSON.stringify(cuocz))
        addCuocCsmmRedisUser(cuoc)
        return cuocz
    }
    else {
        let cuocsJ = JSON.parse(cuocs)
        cuocsJ.unshift(cuoc)
        if (cuocsJ.length > 100) {
            cuocsJ.pop();
        }
        await redisClient.set(key, JSON.stringify(cuocsJ))
        addCuocCsmmRedisUser(cuoc)
        return cuocsJ
    }
}

addCuocCsmmRedisUser = async (cuoc) => {
    cuoc.__v = 9999;
    const keyUser = keyCuocsRedis + cuoc.uid
    const cuocs = await redisClient.get(keyUser)
    if (!cuocs) {
        const cuocz = [cuoc]
        await redisClient.set(keyUser, JSON.stringify(cuocz))
        return cuocz
    }
    else {
        let cuocsJ = JSON.parse(cuocs)
        cuocsJ.unshift(cuoc)
        if (cuocsJ.length > 20) {
            cuocsJ.pop();
        }
        await redisClient.set(keyUser, JSON.stringify(cuocsJ))
        return cuocsJ
    }
}

updateCuocCsmmRedisId = async (cuoc) => {
    const key = keyCuocsRedis + "Server" + cuoc.server
    const cuocs = await redisClient.get(key)
    if (cuocs) {
        var cuocsJ = JSON.parse(cuocs)
        
        let index = cuocsJ.findIndex(x => x._id.toString() == cuoc._id.toString())


       // console.log(cuocJ.at(index))
        if (index != -1) {
            cuocsJ[index].ketqua = cuoc.ketqua
            cuocsJ[index].vangnhan = cuoc.vangnhan
            cuocsJ[index].status = cuoc.status

            await updateCuocUserCsmmRedisId(cuoc)
        }


        await redisClient.set(key, JSON.stringify(cuocsJ))
    }
}

updateCuocUserCsmmRedisId = async (cuoc) => {
    const key = keyCuocsRedis + cuoc.uid
    const cuocs = await redisClient.get(key)
    if (cuocs) {
        var cuocsJ = JSON.parse(cuocs)
        const index = cuocsJ.findIndex(x => x._id.toString() == cuoc._id.toString())
        if (index != -1) {
            
            cuocsJ.splice(index,1)

        }
        await redisClient.set(key, JSON.stringify(cuocsJ))
    }
}



getCuocCsmmRedis = async (server) => {
    const keycuoc = keyCuocsRedis + "Server" + server
    const mess = await redisClient.get(keycuoc)
    if (!mess) {
        return []
    }
    else {
        return JSON.parse(mess)
    }
}
getCuocCsmmUserRedis = async (uid) => {
    const keycuoc = keyCuocsRedis + uid
    const mess = await redisClient.get(keycuoc)
    if (!mess) {
        return []
    }
    else {
        return JSON.parse(mess)
    }
}

module.exports = { getCuocCsmmUserRedis, getCuocCsmmRedis, updateCuocCsmmRedisId, addCuocCsmmRedisUser, addCuocCsmmRedis }