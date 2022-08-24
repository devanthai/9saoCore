const router = require('express').Router()
const User = require('../../../models/User')
const userControl = require('../../../controller/user')
const Botthoi = require('../../../models/Botthoi')
const Napthoi = require('../../../models/Napthoi')
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
router.get('/',async(req,res)=>{
    if(req.query.action=="get")
    {
        const tnv = req.query.tnv
        const server = req.query.server
        const lsvang = await Napthoi.findOne({server:server,status:0,tnv:tnv})
        
        if(lsvang)
        {
          return  res.send(lsvang._id+"|"+lsvang.sothoi+"|"+lsvang.uid)
        }
        else return res.send("khongco")
    }
    else if(req.query.action == "done")
    {
        const id = req.query.id
        const tnv = req.query.tnv
        const truocgd = req.query.truocgd
        const saugd = req.query.saugd
        const lsvang = await Napthoi.findOneAndUpdate({_id:id,status:0},{status:1})
        if(lsvang)
        {
            const sovanggg = lsvang.sothoi*37000000
            const user =await userControl.upMoney(lsvang.uid,sovanggg)
            if(user)
            {
                const sodu = await userControl.sodu(lsvang.uid,"+"+numberWithCommas(sovanggg),"Nạp thỏi")
                return res.send("thanhcong")
            }
        }
        else
        {
            return res.send("thatbai")
        }
        
    }
    else if(req.query.action == "info")
    {
        const map = req.query.map
        const server = req.query.server
        const khu = req.query.khu
        const tnv = req.query.tnv
        const sothoi = req.query.sothoi
        const taikhoan = req.query.taikhoan
        if(map&&server&&khu&&tnv&&sothoi&&taikhoan){
            const botnap = await Botthoi.findOneAndUpdate({ tnv: tnv,server:server  ,taikhoan:taikhoan },{tnv:tnv,server:server,taikhoan:taikhoan,khu:khu,map:map,sothoi:sothoi})
            if(!botnap){
                const cc = await new Botthoi({tnv:tnv,server:server,taikhoan:taikhoan,khu:khu,map:map,sothoi:sothoi}).save()
                console.log(cc)
            }
            return res.send("update")
        }
    }
    res.send("error")
})
module.exports = router
