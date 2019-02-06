const WS = require('ws')
const ws = new WS('ws://localhost:9000')

ws.on('connect', () => {
    
})

ws.on('message', (msg) => {
    //console.log(msg)
})

setTimeout(() => {
    ws.send(JSON.stringify({
        jsonrpc: '2.0',
        method: 'orderbook',
        id: 1
    }))
}, 2000)
