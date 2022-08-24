
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const token = '5078416522:AAERaLPP0Yp1B6S501ty6uhSDukhTxX1-LU';

const bot = new TelegramBot(token, { polling: true });

module.exports = bot