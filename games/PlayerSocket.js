const BauCua = require('./baucua');
const Lucky = require('./lucky');
const TaiXiu = require('./taixiu');
const ChanLe = require('./chanle');
const MiniPoke = require('./miniPoke');
const BtcGame = require('./bitcoin');


let isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
let SocketPlayer = []
let io = (io, app) => {

    io.on('connection', client => {
        client.on('connect_failed', function () {
            console.log("Sorry, there seems to be an issue with the connection!");
        })
        client.on('connect_error', function () {
            console.log("Sorry, there seems to be an issue with the connection!");
        })
        client.on("CHAT", (message) => {
            try {
                let obj = JSON.parse(message);
                if (obj.type === "CHAT") {
                    if (obj.token && obj.name && obj.sodu && obj.noidung) {
                        let noidung = obj.noidung;
                        const sodu = obj.sodu;
                        const name = obj.name;
                        const vip = obj.vip;
                        const clan = obj.clan;
                        const top = obj.top;
                        const type = obj.typechat;
                        const token = obj.token;
                        if (!isHTML(noidung) && !isHTML(sodu) && !isHTML(name) && !isHTML(vip) && !isHTML(clan) && !isHTML(top) && !isHTML(type) && !isHTML(token)) {
                            client.broadcast.emit("CHAT", JSON.stringify(obj));
                        }
                    }
                }
            } catch { }
        })
        const clientIp2 = client.request.socket.remoteAddress || client.request['x-forwarded-for'];
        const clientIp = client.handshake.address
       
        try {
          
            if (client.request.session.userId) {
                const indexP = SocketPlayer.findIndex(p => p.userId == client.request.session.userId)
                if (indexP != -1) {
                    const player = SocketPlayer[indexP]
                    io.to(player.socket).emit("disconnectnha", "Vui lòng chỉ truy cập 1 thiết bị")
                    SocketPlayer.splice(indexP, 1);
                }
            }
            if (client.request.session.userId != undefined) {
                SocketPlayer.push({ socket: client.id, userId: client.request.session.userId, ip: clientIp, name: client.request.session.name })
            }
            client.on('disconnect', () => {
                const indexP = SocketPlayer.findIndex(p => p.socket == client.id)
                if (indexP != -1) {
                    SocketPlayer.splice(indexP, 1);
                }
            });
        } catch (err) { console.log(err) }
    });
    TaiXiu.taixiu(io, app);
    ChanLe.chanle(io, app);
    BauCua.baucua(io, app);
    Lucky.gamestart(io, app)
    MiniPoke.game(io)
    BtcGame.start(io,app)
}
module.exports = { io, SocketPlayer }
exports.SocketPlayer = SocketPlayer