const WS = require('ws')
const wss = new WS.Server({
    port: 9000
})

wss.on('connection', ws => {
    ws.on('message', msg => {
        handleMessage(ws, msg)
    })
    ws.on('close', () => {
        handleClose(ws)
    })
})

const jsonrpc = require('./jsonrpc')

function handleMessage(ws, msg) {
    console.log(msg);
    jsonrpc(ws, msg, methods)
}

function handleClose(ws) {
    
}

const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL)

const RPC = require('./rpc')
const rpc = new RPC()

const methods = {
    'orderbook': rpc.orderbook,
    'lasttrades': rpc.lastTrades,
    'auth': rpc.auth,
    'buy': rpc.buy,
    'sell': rpc.sell,
    'cancel': rpc.cancel,
    'positions': rpc.positions,
    'openorders': rpc.openOrders,
    'orderhistory': rpc.orderHistory,
    'tradehistory': rpc.tradeHistory
}

const broker = {
    broadcast(msg) {
        msg = JSON.stringify(msg)
        wss.clients.forEach(ws => {
            if (ws.readyState === WS.OPEN) {
                ws.send(msg)
            }
        })
    },

    send(user, msg) {
        msg = JSON.stringify(msg)
        wss.clients.forEach(ws => {
            if (ws.readyState === WS.OPEN && ws.user === user) {
                ws.send(msg)
            }
        })
    }
}

const streams = require('./streams')
new streams.Time(broker)
new streams.Orderbook(broker)
new streams.Index(broker, redis)
new streams.Funding(broker, redis)
new streams.Account(broker)
new streams.Positions(broker)

const Rabbit = require('./rabbit')
const rabbit = new Rabbit(process.env.RABBIT_URL)

const events = require('./events')
new events.LastTrade(broker, rabbit)
new events.UserTrade(broker, rabbit)
new events.UserOrder(broker, rabbit)
