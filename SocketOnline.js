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

let SocketPlayer = []

io.on("connection", (socket) => {
    const IP = socket.request['x-real-ip'];

    console.log(socket.id + " connected "+IP)

    socket.on("userOnline-admin", (data) => {
        socket.emit("userOnline-admin", SocketPlayer)
    })
    SocketPlayer.push({ socket: socket.id,IP })
    socket.on("disconnect", () => {

        const indexP = SocketPlayer.findIndex(p => p.socket == socket.id)
        if (indexP != -1) {
            SocketPlayer.splice(indexP, 1);
            console.log(socket.id + " disconnected")

        }
    })
})

server.listen(9956, () => console.log('Server Running on port 9956'));