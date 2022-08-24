const Hu = require("../models/minipoke/Hu")
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