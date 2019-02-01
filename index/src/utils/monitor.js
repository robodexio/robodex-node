const Redis = require('ioredis')
const redis = new Redis()

redis.subscribe('ETH_INDEX_CHANNEL')
redis.on('message', (ch, msg) => {
    console.log(ch)
    console.log(JSON.parse(msg))
})
