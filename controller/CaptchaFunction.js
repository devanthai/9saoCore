
const bcrypt = require('bcryptjs')
let Captcha = require('node-captcha-generator');


mahoaCaptcha = async (captcha) => {
    const salt = await bcrypt.genSalt(10)
    const hashCaptcha = await bcrypt.hash(captcha, salt)
    return hashCaptcha;
}
checkCaptcha = async (captcha, hash) => {
    try {
        if (captcha == undefined || hash == undefined) {
            return false
        }
        const salt = await bcrypt.genSalt(10)
        const vipp = await bcrypt.compare(captcha, hash)
        if (!vipp) {
            return false
        }
    } catch (error) {
        return false

    }
    return true;
}
getRandomCap = async () => {
    var c = new Captcha({
        length: 5, // Captcha length
        size: {    // output size
            width: 450,
            height: 200
        }
    });
    const salt = await bcrypt.genSalt(10)
    const hashCaptcha = await bcrypt.hash(c.value, salt)
    return hashCaptcha;
}
module.exports = { mahoaCaptcha, checkCaptcha, getRandomCap }
