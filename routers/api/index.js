const router = require('express').Router()
const userControl = require('../../controller/user');
const User = require('../../models/User')

router.get('/api/verify',async function(req, res){

    var taikhoan = req.query.noidung.toString().toLowerCase();
    var sdt = req.query.phone;
    if(sdt==""||taikhoan=="")
    {
        
        return res.send("Lỗi")
    }
    const checksdt = await User.findOne({sdt:sdt})
    if(checksdt){
        return res.send("Số này đã kích hoạt rồi")
    }
    else
    {
        const user = await User.findOne({username:taikhoan})
        if(!user)
        {
            return res.send("Không tìm thấy tài khoản") 
        }
        if(user.sdt==0)
        {
            const upsdt = await User.updateOne({username: taikhoan},{sdt:sdt});
            const upmoneyz = await userControl.upMoney(user._id,10000000)
            const upsodu = await userControl.sodu(user._id,"+10,000,000","Xác thực số điện thoại")
            
            const upmoneyzz = await userControl.upKimcuong(user._id,5)
            return res.send("Xác thực thành công") 
        }
        else
        {
            return res.send("Tài khoản này đã kích hoạt rồi")
        }
    }


})
const authRoute = require('./auth');
const posts = require('./posts');
const game = require('./gameApi');
const napthe = require('./napthe');
const napvang = require('./vang/napvang');
const napthoi = require('./vang/napthoi');
const rutvang = require('./vang/rutvang');
const checkid = require('./vang/checkid');


router.use('/user',authRoute)
router.use('/posts',posts)  
router.use('/game',game)  
router.use('/napthe',napthe)  
router.use('/napvang',napvang)  
router.use('/napthoi',napthoi)  
router.use('/rutvang',rutvang)  
router.use('/checkid',checkid)  

router.get('/',(req,res)=>{
    res.send("API")
})  


module.exports = router