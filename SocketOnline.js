const express = require('express');
const cors = require('cors');
const app = express()
app.use(cors())
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000", "https://9sao.me", "https://fbnguvcl.xyz", "https://socket.9sao.me"


            ,
            'https://www.9sao.me',
            'https://200kz.com',
            'https://www.200kz.com',
            'https://500kz.com',
            'https://www.500kz.com',
            'https://www.9sao.club',
            'https://9sao.club',
            'https://www.cltxnr.com',
            'https://cltxnr.com',
            'https://www.cltxnro.com',
            'https://cltxnro.com',
            'https://luachua.com',
            'https://www.luachua.com',
            'https://www.nrcltx.com',
            'https://nrcltx.com',
            'https://nroauto.com',
            'https://www.nroauto.com',
            'https://nrotx.com',
            'https://www.nrotx.com',

        ],
        methods: ["GET", "POST"]
    }
});

let SocketPlayer = {}


io.on("connection", (socket) => {

    //console.log(socket)
    let Requsername = socket.handshake.query.username
    let ReqTenhienthi = socket.handshake.query.tenhienthi
    let Ip = socket.handshake.headers['x-real-ip']
    let referer = socket.handshake.headers.referer
    console.log(referer)
    socket.on("userOnline-admin", (data) => {
        socket.emit("userOnline-admin", SocketPlayer)
    })

    socket.on("mess-admin", (data) => {
        const { password, type } = data
        if (password == "thaivipyeu") {
            if (type == "sendMess") {
                const { socket, message } = data
                io.to(socket).emit("messageFromServer", message)
            }
            else if (type == "getUser") {
                socket.emit("getUser", SocketPlayer)
            }
        }
    })
    //add player
    SocketPlayer[socket.id] = { username: Requsername || null, tenhienthi: ReqTenhienthi || null, timeConnect: new Date().getTime(), Ip: Ip }
    socket.on("disconnect", () => {
        //remove player
        delete SocketPlayer[socket.id]
    })
})

server.listen(9956, () => console.log('Server Running on port 9956'));