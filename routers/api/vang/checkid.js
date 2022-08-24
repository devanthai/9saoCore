const router = require('express').Router()
const Botvang = require('../../../models/Botvang')
const Idnaprut = require('../../../models/Idnaprut')
router.get('/',async(req,res)=>{
    const action = req.query.action
    if(action=="tnvvang")
    {
        const nv = await Botvang.findOne({tnv:req.query.tnvvang})
       
        if(nv)
        {
            return res.send(nv.vang+"")
        }
        return res.send("")
    }
    else if(action=="get")
    {
        const botvang = await Botvang.find({})
        if(botvang)
        {
            return res.send(botvang)
        }
        res.send("")
    }
    else if(action=="addid")
    {
        const tnv = req.query.tnv
        const chccc = await Idnaprut.findOne({tnv:tnv})
        if(!chccc)
        {
            await new Idnaprut({tnv:tnv}).save()
        }
        res.send("")
    }
    else if(action=="check")
    {
        const tnv = req.query.tnv
        const chccc = await Idnaprut.findOne({tnv:tnv})
        if(chccc)
        {
           return res.send("okegd")
        }
        return res.send("cutgd")
    }
    else if(action=="info")
    {
        const server = req.query.sv
        const vang = req.query.vang
        const zone = req.query.zone
        const tnv    = req.query.tnv
        const type = req.query.type
        const acccc = await Botvang.findOneAndUpdate({ server:server,tnv:tnv,type:type},{khu:zone,vang:vang})
        if(!acccc)
        {
            await new Botvang({server:server,tnv:tnv,vang:vang,type:type}).save()
        }
        return res.send("")

    }
})
module.exports = router
