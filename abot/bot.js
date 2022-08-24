const TelegramBot = require('node-telegram-bot-api');
const token = '5591862801:AAHH2ShoIZz7CRgRUa8zEBTzG3-WV-jXRwY';
const bot = new TelegramBot(token, { polling: true });

var idGroupppp = -622463548
sendToGroup = (mess) => {
    bot.sendMessage(idGroupppp, mess)
}

module.exports = { sendToGroup }