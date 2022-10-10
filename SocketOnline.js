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

   // console.log(socket)
    let Requsername = socket.handshake.query.username
    let ReqTenhienthi = socket.handshake.query.tenhienthi
    let Ip = socket.handshake.headers['x-forwarded-for']
    let pathConnect = socket.handshake.query.path
    let referer = socket.handshake.headers.referer

    //add player
    SocketPlayer[socket.id] = { username: Requsername || null, tenhienthi: ReqTenhienthi || null, timeConnect: new Date().getTime(), Ip: Ip, path: pathConnect }
    console.log(SocketPlayer[socket.id])


    if(referer.includes("fbnguvcl.xyz"))
    {
        socket.join("admin")
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
        socket.on("userOnline-admin", (data) => {
            socket.emit("userOnline-admin", SocketPlayer)
        })
    }

    io.to("admin").emit("addPlayer",SocketPlayer[socket.id])
    
    socket.on("disconnect", () => {
        //remove player
        io.to("admin").emit("removePlayer",SocketPlayer[socket.id])
        delete SocketPlayer[socket.id]
    })
})

server.listen(9956, () => console.log('Server Running on port 9956'));