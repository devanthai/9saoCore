const router = require('express').Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {registerValidation,loginValidation} = require('../../models/validation')

router.post('/register',async (req,res)=>{
    
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const usernameExist = await User.findOne({username:req.body.username})
    if(usernameExist) return res.status(400).send('Tài khoản này đã tồn tại')
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password,salt)
    const user = new User({username:req.body.username, password:hashPassword })
    try
    {
        const savedUser = await user.save()
        res.send({user:user._id})
    }
    catch(err){  res.status(400).send(err) }
})



router.post('/login',async (req,res)=>{
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const user = await User.findOne({username:req.body.username})
    if(!user) return res.status(400).send('Tài khoản hoặc mật khẩu không chính xác')

    const vaildPass = await bcrypt.compare(req.body.password,user.password)
    if(!vaildPass) return res.status(400).send('Tài khoản hoặc mật khẩu không chính xác')

    const token =  jwt.sign({_id:user._id},process.env.TOKEN_SECRET,{ expiresIn: process.env.TIME_TOKEN });
    res.header('auth-token',token).json({message:"Đăng nhập thành công",token:token});
})
router.get('/',(req,res)=>{
    res.send("USER")
})  

module.exports = router