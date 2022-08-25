const request = require('request');
const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: 'bBhf26Te2H5UhYdcRwrNMx6nrCaM92vNoBScgVxXUkx6pbUPlZNGyg7QPoPWTya9',
    APISECRET: 'QlHo0Eabyhz6YulqCZQ4nmIu8hkKBcFFtdmUwUwijfGzwcYrefMvuzMv2ardoI3S'
});

let AmountClose = 0;
const GetCandle = () => {
    request.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1', function (error, response, body) {
        if (!error) {
            let candle = JSON.parse(body)
            AmountClose = candle[0][4] || -1
        }
    })
}
GetCandle()
// setInterval(() => {
//     GetCandle()
// }, 300);

class GameBTC {
    start = (io, app) => {
        // app.post("/bitcoin")
        io.on('connection', client => {
            client.on('connect_failed', function () {
                console.log("Sorry, there seems to be an issue with the connection!");
            })
            client.on('connect_error', function () {
                console.log("Sorry, there seems to be an issue with the connection!");
            })
            console.log("Connect bitcoin " + client.id)
        })
    }
}
module.exports = new GameBTC
