const WS = require('ws')
const ws = new WS('ws://localhost:9000')

ws.on('connect', () => {

})

ws.on('message', (msg) => {
    console.log(msg)
})