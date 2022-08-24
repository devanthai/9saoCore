const router = require('express').Router()
const Game = require('../../models/Game')
router.get('/getCsmm',async (req,res)=>{
    const ketqua = req.query.kq
    const time = req.query.time
    const server = req.query.server
    const timecsmm = req.query.timecsmm
    const phienChay = await Game.findOne({server:server,status:0})
    if(!phienChay)
    {
        const game = new Game({ server:server,ketquatruoc:ketqua,time:time,timeCsmm:timecsmm })
        try
        {
            const savedgame = await game.save()
            return res.send(savedgame)
        }
        catch(err){return  res.status(400).send(err) }
    }   
    else if(time>phienChay.time)
    {
        let game = await Game.findOneAndUpdate({ server: server,status:0 }, { status: 1 });
        const Newgame = new Game({ server:server,ketquatruoc:ketqua,time:time,timeCsmm:timecsmm })
        try
        {
            const savedgame = await Newgame.save()
            return res.send("Tao phien thanh cong")
        }
        catch(err){ return res.status(400).send(err) }
        
    }
    let updateTime = await Game.findOneAndUpdate({ server: server,status:0 }, { time: time });
    if(updateTime)
    {
      return  res.send('Cập nhật time '+time+' Server '+server)
    }
    res.send('...')
})
module.exports = router