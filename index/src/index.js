const exchanges = require('./exchanges')
const providers = [
    new exchanges.binance('ETHUSDT'),
    new exchanges.bitstamp('ethusd'),
    new exchanges.kraken('XETHZUSD')
]
providers.forEach((p) => p.start())

start()

function start() {
    setInterval(calculateIndex, 1000)
}

var prevPrice = null

function calculateIndex() {
    const snapshot = providers.map((p) => ({
        name: p.name,
        online: p.online,
        ask: p.ask,
        bid: p.bid,
        price: p.price,
        time: p.time,
        part: null,
        latency: p.latency
    }))

    let online = snapshot.filter((p) => p.online)
    online = online.sort((a, b) => {
        return a.price - b.price
    })

    if (online.length === 0) {
        console.log('Empty online')
        console.log(snapshot)
        prevPrice = null
        return handleIndex(null)
    }

    const price = online.reduce((a, c) => a + c.price, 0) / online.length

    online.forEach((p) => {
        p.part = 1 / online.length
    })

    const index = {
        name: 'ETH',
        price,
        prevPrice,
        time: Date.now(),
        parts: snapshot
    }

    prevPrice = price

    console.log(index)

    handleIndex(index)
}

function handleIndex(index) {
    storeIndexInRedis(index)
    storeIndexInPostgres(index)
}

// Postgres

const pgp = require('pg-promise')()
const db = pgp(process.env.PG_URL)

function storeIndexInPostgres(index) {
    if (!index) {
        return
    }

    db.none(
        'INSERT INTO indexes (name, price, time, parts) VALUES ($1, $2, $3, $4)', 
        [index.name, index.price, (new Date(index.time)).toISOString(), JSON.stringify(index.parts)]
    ).then(() => {
        console.log('Insert index to postgres')
    }).catch((err) => {
        console.error(err)
    })
}

// Redis

const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL)

function storeIndexInRedis(index) {
    redis.set('ETH_INDEX', JSON.stringify(index), 'EX', 2)
    redis.publish('ETH_INDEX_CHANNEL', JSON.stringify(index))
}
