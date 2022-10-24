const Hu = require("../models/hoaqua/Hu")
const redis = require('redis')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../.env') })
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true,useNewUrlParser: true }, () => console.log('Connected to db'));
const client = redis.createClient();
client.on('error', (err) => {
    client.connect()
    console.log("Error " + err)
});

const subscriber = client.duplicate();
client.connect();
// cách xóa key: client.del(keyTopSpinPoke)
subscriber.connect();



//top thắng
const keyTopSpinPoke = "TopSpinHoaQua"

//lịch sử quay: lấy key+uid là ra
const keyHisSpin = "hisSpinHoaQua"

//lịch sử trúng hũ
const keyHistrunghu = "hisTrunghuHoaQua"


//[username:"devanthai",vangwin:1000000]
subscriber.subscribe('addTopHoaQua', async (message) => {

    try {
        var dataJ = JSON.parse(message)
        var topDatas = await client.get(keyTopSpinPoke)
        if (!topDatas) {
            await client.set(keyTopSpinPoke, JSON.stringify([dataJ]))
        }
        else {
            var data = JSON.parse(topDatas)
            const index = data.findIndex(object => {
                return object.username === dataJ.username;
            });
            if (index != -1) {
                data[index].vangwin += dataJ.vangwin
            }
            else {
                data.push(dataJ)
            }
            data.sort(dynamicSort("-vangwin"));
            await client.set(keyTopSpinPoke, JSON.stringify(data))
        }
    }
    catch (err) {
        console.log(err)
    }
});

//     uid: '62bc70a42289202e20a8fedd',
//     goldBet: 1000000,
//     goldWin: 0,
//     result: [ { name: "21", bai: 2, type: 1 },... ],
//     beforeBet: 775773000000,
//     afterBet: 775772000000,
//     time: 1659259538321
subscriber.subscribe('addHisHoaQua', async (message) => {
    try {
        var dataSend = JSON.parse(message)
        const keyuserhis = keyHisSpin + dataSend.uid.toString()
        var hisDatas = await client.get(keyuserhis)
        if (!hisDatas) {
            await client.set(keyuserhis, JSON.stringify([dataSend]))
        }
        else {
            var hisuser = JSON.parse(hisDatas)
            hisuser.unshift(dataSend)
            await client.set(keyuserhis, JSON.stringify(hisuser))
        }
        let muccuoc = 1
        if (dataSend.goldBet == 1000000) {
            muccuoc = 1
        }
        else if (dataSend.goldBet == 5000000) {
            muccuoc = 2
        }
        else if (dataSend.goldBet == 50000000) {
            muccuoc = 3
        }
        else {
            muccuoc = 4
        }
        var zzzz = await Hu.findOne({ muccuoc: muccuoc, isBum: false })
        if(zzzz)
        {
            const percentHu = Math.round(Number(dataSend.goldBet / 0.99)) - dataSend.goldBet
            zzzz.vanghu+=percentHu
            zzzz.save()
        }
    }
    catch (err) {
        console.log(err)
    }
})


//     uid: '62bc70a42289202e20a8fedd',
//     username: 'test',
//     goldBet: 1000000,
//     goldWin: 0,
//     result: [ { name: "21", bai: 2, type: 1 },... ],
//     beforeBet: 775773000000,
//     afterBet: 775772000000,
//     time: 1659259538321
subscriber.subscribe('addHisTrungHuHoaQua', async (message) => {
    try {
        var dataSend = JSON.parse(message)
        var hisDatas = await client.get(keyHistrunghu)
        if (!hisDatas) {
            await client.set(keyHistrunghu, JSON.stringify([dataSend]))
        }
        else {
            var hishu = JSON.parse(hisDatas)
            hishu.unshift(dataSend)
            await client.set(keyHistrunghu, JSON.stringify(hishu))
        }
    }
    catch (err) {
        console.log(err)
    }
})


function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}