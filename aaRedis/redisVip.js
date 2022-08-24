const redis = require('redis')
const client = redis.createClient();
client.on('error', (err) => {
    client.connect()
    console.log("Error " + err)
});
const keyGetVipRedis = "keygetvip2"

const subscriber = client.duplicate();
client.connect();
// cách xóa key: client.del(keyTopSpinPoke)
subscriber.connect();

subscriber.subscribe('addAmountVip', async (message) => {
    const messJson = JSON.parse(message)
    const getvip = await client.get(keyGetVipRedis)
    if (getvip) {
        let jsonvipusers = JSON.parse(getvip)
        if (jsonvipusers[messJson.uid] == undefined) {
            jsonvipusers[messJson.uid] = Number(messJson.value)
        }
        else {
            jsonvipusers[messJson.uid] = Number(jsonvipusers[messJson.uid]) + Number(messJson.value)
        }
        await client.set(keyGetVipRedis, JSON.stringify(jsonvipusers))
    }
})