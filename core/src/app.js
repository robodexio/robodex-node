const pgp = require('pg-promise')()
const db = pgp(process.env.PG_URL)

const camelcase = require('camelcase-keys')

function fetchInstruments() {
    return db.any('SELECT * FROM instruments').then(camelcase)
}

const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL)

fetchInstruments().then((instruments) => {
    console.log(instruments)
    redis.set('INSTRUMENTS', JSON.stringify(instruments))
    redis.publish('INSTRUMENTS', JSON.stringify(instruments))
})
