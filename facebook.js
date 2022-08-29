const express = require('express')
const app = express()

process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const token = '5660525904:AAFq7VzuqlmeGQKBSew4sZNWYYANc0y6rf4';

const bot = new TelegramBot(token, { polling: true });

const chatID = -730769209

module.exports = bot
app.post('/', function (req, res) {
    console.log(req.body)

  //  bot.sendMessage(chatID,req)

    res.send('Hello World')
})
app.get("/",(req,res)=>{
    res.send(`1107773047`)
})
app.listen(6666,()=>console.log("Server start port 6666"))