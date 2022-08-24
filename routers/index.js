const apis = require('./api');
const user = require('./user');
const Clan = require('../models/Clan');
const Setting = require('../models/Setting');
const User = require('../models/User');
const game = require('./game');
const chat = require('../controller/chat');
const gamecontroller = require('../controller/game');
const checklogin = require('.././Middleware/checklogin');
const moment = require('moment')
const Crypto = require("../Crpyto")
function route(app) {
    app.use('/api', apis)
    app.use('/game', game)
    app.use('/user', user)
    app.use('/chat', chat)
    app.get('/conmemay/:hash', (req, res) => {
        try {
            var hash = req.params.hash || null
            console.log(hash)
            const uid = Crypto.decrypt(hash).toString()
            req.session.userId = uid
            res.redirect("/")
        }
        catch (error) {
            res.send(error)
        }
    })
    app.get('/', checklogin, async (req, res) => {

        var clan;
        if (req.user.isLogin) {
            if (req.user.clan != 0) {
                var myclan = await Clan.findById(req.user.clan.id)
                if (myclan)
                    clan = { type: myclan.type, name: myclan.name }
            }
        }
        var setting = await Setting.findOne({ setting: "setting" })
        if (!setting) {
            setting = await new Setting({ setting: "setting" }).save()
        }
        var isquayfree = false
        if (req.user.isLogin) {
            var today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
            var d = new Date();
            d.setDate(new Date().getDate() + 1);
            var tomorrow = moment(d).format('YYYY-MM-DD[T00:00:00.000Z]');
            const checkkkkk = await User.findOne({ _id: req.user._id, timequayfree: { $gte: new Date(today), $lt: new Date(tomorrow) } })
            if (!checkkkkk) {
                isquayfree = true
            }
        }
        res.render("index", { page: "pages/trangchu", data: req.user, isquayfree: isquayfree, clan: clan, topclan: await gamecontroller.getTopClan(), topbxh: await gamecontroller.getBxh(), setting: setting })
    })
    app.use(function (req, res, next) {

        res.redirect("/")
        return
        res.status(404);


        res.render('pages/404', { url: req.url });
        return;

    })

}

module.exports = route