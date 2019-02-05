const WS = require('ws')
const ws = new WS('wss://api.robodex.io')

ws.on('connect', () => {

})

ws.on('message', (msg) => {
    console.log(msg)
})