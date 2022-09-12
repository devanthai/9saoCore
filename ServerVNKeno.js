const express = require('express')
const app = express()
const request = require('request')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }))
app.use(bodyParser.json({ limit: '30mb' }))

let result = null

setInterval(() => {
    request.get("https://www.minhchinh.com/livekqxs/xstt/js/KN.js",(error, response, body)=>{
        if(!error)
        {
            result = body
        }
    })
}, 5000);


app.get('/', (req, res) => {
    res.send(result)
})
const server = require('http').createServer(app);
server.listen(5800, () => console.log('Server get keno on port 5800'));