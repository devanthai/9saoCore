const express = require('express');
const cors = require('cors');
const app = express()
app.use(cors())
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:3000", "https://9sao.me", "https://fbnguvcl.xyz"],
        methods: ["GET", "POST"]
    }
});

let SocketPlayer = []

io.on("connection", (socket) => {
    console.log(socket.id + " connected")

    socket.on("userOnline-admin", (data) => {
        socket.emit("userOnline-admin", SocketPlayer)
    })
    SocketPlayer.push({ socket: socket.id })
    socket.on("disconnect", () => {
        const indexP = SocketPlayer.findIndex(p => p.socket == socket.id)
        if (indexP != -1) {
            SocketPlayer.splice(indexP, 1);
            console.log(socket.id + " disconnected")

        }
    })
})

server.listen(9956, () => console.log('Server Running on port 9956'));