const WS = require('ws')
const wss = new WS.Server({
    port: 9000
})

wss.on('connection', ws => {

})

setInterval(() => {
    wss.clients.forEach(ws => {
        if (ws.readyState === WS.OPEN) {
            ws.send(JSON.stringify({
                stream: 'time',
                data: Date.now()
            }))
            ws.send(JSON.stringify({
                stream: 'index',
                data: {
                    price: 108.32,
                    exchanges: [
                        {
                            name: 'Bitstamp',
                            price: 108.43,
                            time: Date.now(),
                            online: true,
                            weight: 50
                        },
                        {
                            name: 'GDAX',
                            price: 108.90,
                            time: Date.now(),
                            online: false
                        },
                        {
                            name: 'Gemini',
                            price: 108.23,
                            time: Date.now(),
                            online: true,
                            weight: 50
                        },
                        {
                            name: 'Kraken',
                            price: 108.53,
                            time: Date.now(),
                            online: true
                        }
                    ]
                }
            }))
            ws.send(JSON.stringify({
                stream: 'account',
                data: {
                    equity: 32.4020323,
                    availableFunds: 4.328582,
                    marginBalance: 50.20302,
                    initialMargin: 4.32030,
                    maintenanceMargin: 3.88592
                }
            }))
            ws.send(JSON.stringify({
                stream: 'orderbook',
                data: {
                    bids: [
                        {
                            qty: 100,
                            price: 323
                        }

                    ],
                    asks: [

                    ],
                    last: 108.20,
                    low: 100.32,
                    high: 110.52,
                    mark: 100.53
                }
            }))

            ws.send(JSON.stringify({
                stream: 'positions',
                data: Date.now()
            }))
        }
    })
}, 1000)
