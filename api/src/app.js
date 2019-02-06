const WS = require('ws')
const wss = new WS.Server({
    port: 9000
})

wss.on('connection', ws => {

})

const broker = {
    broadcast(msg) {
        msg = JSON.stringify(msg)

        wss.clients.forEach(ws =>{
            if (ws.readyState === WS.OPEN) {
                ws.send(msg)
            }
        })
    }
}

const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL)

const streams = require('./streams')
new streams.Time(broker)
new streams.Orderbook(broker)
new streams.Index(broker, redis)
new streams.Funding(broker)
new streams.Account(broker)
new streams.Positions(broker)
