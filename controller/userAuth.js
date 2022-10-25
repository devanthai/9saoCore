const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const checklogin = require('../Middleware/checklogin');
const CaptchaFunction = require('./CaptchaFunction');

const { registerValidation, loginValidation } = require('../models/validation')
router.get('/register', checklogin, (req, res) => {
    if (req.session.userId) {
        return res.redirect('/')
    }
    var page = "pages/user/dangky";
    res.render("index", { page: page, data: req.user });
});
router.get('/login', checklogin, (req, res) => {
    if (req.session.userId) {
        return res.redirect('/')
    }
    var page = "pages/user/dangnhap";
    res.render("index", { page: page, data: req.user });
});
router.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        // cannot access session here
     })
    res.redirect('/')
});
router.post('/register', async (req, res) => {

    var server = req.body.server
    var username = req.body.username.toLowerCase()
    var password = req.body.password.toLowerCase()
    var checkCaptcha = await CaptchaFunction.checkCaptcha(req.body.captcha, req.session.captcha)

    if (!checkCaptcha) {
     
        return res.send({ error: 1, msg: "Bạn đã nhập sai captcha!" })
    }
 
    if (isNaN(server)) {
        return res.status(200).send({ error: 1, msg: 'Máy chủ không hợp lệ' })
    }
    else if (server < 1 || server > 10) {
        return res.status(200).send({ error: 1, msg: 'Máy chủ không hợp lệ' })
    }

    const { error } = registerValidation(req.body)
    if (error) return res.status(200).send({ error: 1, msg: error.details[0].message })

    var taikhoanc = username.match(/([0-9]|[a-z]|[A-Z])/g);
    var matkhauc = password.match(/([0-9]|[a-z]|[A-Z])/g);
    if (taikhoanc.length != username.length) {
        return res.status(200).send({ error: 1, msg: 'Tài khoản không hợp lệ' })
    }
    else if (matkhauc.length != password.length) {
        return res.status(200).send({ error: 1, msg: 'Mật khẩu không hợp lệ' })
    }
    else if (username == password) {
        return res.status(200).send({ error: 1, msg: 'Tài khoản không được giống mật khẩu' })
    }
    else if (username.includes(password)) {
        return res.status(200).send({ error: 1, msg: 'Tài khoản không được giống mật khẩu' })
    }
    else if (password.includes(username)) {
        return res.status(200).send({ error: 1, msg: 'Tài khoản không được giống mật khẩu' })
    }
    else if (password.includes('123') || password.includes('456') || password.includes('789') || password.includes('321')) {
        return res.status(200).send({ error: 1, msg: 'Mật khẩu không được dễ đoán như 123, 456, 789, 321 ....' })
    }


    const usernameExist = await User.findOne({ username: username })
    if (usernameExist) return res.status(200).send({ error: 1, msg: 'Tài khoản này đã tồn tại vui lòng chọn tài khoản khác' })
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const user = new User({ username: username, password: hashPassword, server: server })
    try {

        const savedUser = await user.save()
        req.session.userId = user._id
        res.send({ error: 0, msg: "Đăng ký thành công" })
        req.session.captcha = await CaptchaFunction.getRandomCap()

    }
    catch (err) { res.status(200).send({ error: 1, msg: "Lỗi không xác định vui lòng thử lại" }) }
})
router.post('/login', async (req, res) => {
    var username = req.body.username.toLowerCase()
    var password = req.body.password.toLowerCase()
    const { error } = loginValidation(req.body)
    if (error) return res.status(200).send({ error: 1, msg: error.details[0].message })
    const user = await User.findOne({ username: username })
    if (!user) return res.status(200).send({ error: 1, msg: 'Tài khoản hoặc mật khẩu không chính xác' })

    const vaildPass = await bcrypt.compare(password, user.password)
    if (!vaildPass) return res.status(200).send({ error: 1, msg: 'Tài khoản hoặc mật khẩu không chính xác' })

    req.session.userId = user._id
    res.send({ error: 0, msg: "Đăng nhập thành công" });
})


module.exports = router