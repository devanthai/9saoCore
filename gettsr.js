const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
var shell = require('shelljs');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/thaiDb", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, () => console.log('Connected to db'));
const express = require('express');
const app = express()
app.set('trust proxy', 1)
const server = require('http').createServer(app);
server.listen(4632, () => console.log('Server Running on port 6488'));

const Tsr = require('./models/Tsr')

var browser = null
var page = null
var cookies = null
var content = null
auto = async () => {
    try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--single-process', '--no-zygote'], headless: true });
        page = await browser.newPage();
        if (cookies == null) {
            await page.goto('https://thesieure.com/account/login', { waitUntil: 'networkidle0' });
            await page.waitForTimeout(2000)
            await page.type("#phoneOrEmail", 'tronganh');
            await page.type("#password", 'xui3454');
            await page.click("button[type='submit']")
        }
        else {
            await page.setCookie(...cookies);
        }
        await page.waitForTimeout(2000)
        await page.goto('https://thesieure.com/wallet/transfer', { waitUntil: 'networkidle0' });
        content = await page.content()
        if (content.includes("20,000,000")) {
            cookies = await page.cookies()
            //console.log(cookies)
            const $ = cheerio.load(content, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            cheerioTableparser($);
            var data = $(".col-sm-12.table-responsive").parsetable(true, true, true);
            // console.log(data)
            for (var i = 1; i < data[0].length; i++) {
                var magd = data[0][i];
                var sotien = data[1][i];
                var ten = data[2][i];
                var time = data[3][i];
                var status = data[4][i];
                var noidung = data[5][i];
                sotien = Number(sotien.replace(/,/g, '').replace("đ", ''))
                if (sotien > 0) {
                    const findGt1s = await Tsr.findOne({ magd: magd })
                    if (!findGt1s) {
                        await new Tsr({ magd: magd, sotien: sotien, timetsr: time, change: true }).save()
                    }
                }
                console.log(magd + "|" + noidung + "|" + sotien)
            }
        }
        else {
            cookies = null
        }
        await page.close()
        await browser.close();
    } catch (error) {
        await page.close()
        await browser.close();
    }
    //shell.exec(`taskkill /IM "chrome.exe" /F`)

}
auto()
setInterval(async () => {
    auto()
}, 60000)

