const exchanges = require('./exchanges')
const providers = [
    new exchanges.Bitstamp('ethusd'),
    new exchanges.Gdax('ETH-USD'),
    new exchanges.Gemini('ethusd'),
    new exchanges.Kraken('XETHZUSD')
]

setInterval(calculateIndex, 1000)

function calculateIndex() {
    const exchanges = providers.map((ex) => ({
        name: ex.name,
        online: ex.online,
        price: ex.price,
        time: ex.time,
        weight: null,
    }))

    let online = exchanges.filter((ex) => ex.online)
    online = online.sort((a, b) => {
        return a.price - b.price
    })

    if (online.length === 0) {
        return handleIndex(null)
    }

    if (online.length > 2) {
        online = online.slice(1, -1)
    }

    const price = online.reduce((p, ex) => p + ex.price, 0) / online.length

    online.forEach((ex) => {
        ex.weight = 1 / online.length
    })

    const index = {
        price,
        exchanges,
        time: Date.now(),
    }

    handleIndex(index)
}

function handleIndex(index) {
    storeIndexInRedis(index)
    //storeIndexInPostgres(index)
}

/*
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


*/

const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL)

function storeIndexInRedis(index) {
    if (index) {
        redis.set('ETH_INDEX', JSON.stringify(index), 'EX', 2)
        redis.set('ETH_INDEX_PRICE', index.price, 'EX', 2)
        redis.publish('ETH_INDEX', JSON.stringify(index))
    } else {
        redis.del('ETH_INDEX', 'ETH_INDEX_PRICE')
    }
}
