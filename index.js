const express = require('express');
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const routers = require('./routers');
const Game = require('./controller/game');
const Keno = require('./controller/keno');
const SocketPlayer = require('./games/PlayerSocket');
const session = require('express-session')
const { createClient } = require("redis");
let RedisStore = require("connect-redis")(session)
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)
app.set('trust proxy', 1)
dotenv.config()

const sessionzzz = session({
  secret: 'aslfkjsldkfssdf,mbndkvjndkrftj000+++',
  store: new RedisStore({ client: redisClient }),
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2400 * 60 * 60 * 1000,
   // secure: true
  }
})
app.use(sessionzzz)
mongoose.connect(process.env.DB_CONNECT, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true
}, () => console.log('Connected to db'));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }))
app.use(bodyParser.json({ limit: '30mb' }))
app.use(express.static('public'))
app.set("view engine", "ejs")
app.set("views", "./views")
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionzzz));
SocketPlayer.io(io, app);
routers(app)

Game.server24(io)
Keno.KenoStart()
server.listen(3000, () => console.log('Server Running on port 3000'));