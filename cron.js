const CronJob = require('cron').CronJob;
const fs = require('fs');
const clientRedis = require("./redisCache")


const cronNewDay = new CronJob('00 00 00 * * *', function () {
    console.log("Hello new day~")
    clientRedis.del("keygetvip2")

}, function () {
    /* This function is executed when the job stops */
},
    true, /* Start the job right now */
    'Asia/Ho_Chi_Minh' /* Time zone of this job. */
);


console.log("Start ok");

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
auto = () => {
    try {
        var countVongquay = {
            "4": 0,
            "5": 0,
            "6": 0
        }
        let zzz = getRndInteger(4, 6)
        countVongquay[zzz] += 1
        zzz = getRndInteger(4, 6)
        countVongquay[zzz] += 1
        console.log(countVongquay)
        fs.writeFile('./config/countvongquay.json', JSON.stringify(countVongquay), 'utf8', () => {
        });
    } catch (error) {
        console.error(error);
    }
    const timeOut = getRandomIntInclusive(600000, 900000)
    console.log(timeOut)
    setTimeout(() => {
        auto()
    }, timeOut);
}
auto()