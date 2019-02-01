const exchanges = require('./exchanges')
const providers = [
    new exchanges.binance('ETHUSDT'),
    new exchanges.bitstamp('ethusd'),
    new exchanges.kraken('XETHZUSD')
]
providers.forEach((p) => p.start())

setInterval(calculate, 1000)

function calculate() {
    console.log('Calculate Index')

    const snapshot = providers.map((p) => ({
        name: p.name,
        online: p.online,
        ask: p.ask,
        bid: p.bid,
        price: p.price,
        time: p.updatedAt
    }))

    snapshot.forEach((p) => {
        console.log(`${p.name}: ${p.online ? p.price : 'offline'}`)
    })

    let online = snapshot.filter((p) => p.online)
    online = online.sort((a, b) => {
        return a.price - b.price
    })

    const price = online.reduce((a, c) => a + c.price, 0) / online.length
    console.log(price)
    console.log()

    //console.log(online)
}
