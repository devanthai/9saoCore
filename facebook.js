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
app.get("/messaging-webhook", (req, res) => {

    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === config.verifyToken) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});
app.get("*", (req, res) => {
    console.log(req.query)
    let challenge = req.query["hub.challenge"];

    res.send(challenge)
});
app.listen(6666, () => console.log("Server start port 6666"))