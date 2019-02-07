const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL)
const subRedis = new Redis(process.env.REDIS_URL)

const Index = require('./services/index')
const index = new Index(subRedis)

const Orderbook = require('./services/orderbook')
const orderbook = new Orderbook()

const Ticker = require('./services/ticker')
const ticker = new Ticker()

var markPrice = null

function calculateMarkPrice() {
    const fairPrice = orderbook.fairPrice
    const indexPrice = index.price
    if (indexPrice) {
        if (fairPrice) {
            return Math.max(Math.min(fairPrice, indexPrice + indexPrice * 0.005), indexPrice - indexPrice * 0.005)
        }
        return indexPrice
    }
    return null
}

setInterval(() => {
    markPrice = calculateMarkPrice()
}, 100)

setInterval(storeOrderbook, 400)

function storeOrderbook() {
    if (ticker.ticker && orderbook.asks && orderbook.bids && markPrice) {
        const result = {
            bids: orderbook.bids,
            asks: orderbook.asks,
            last: parseFloat(ticker.ticker.lastPrice),
            low: parseFloat(ticker.ticker.lowPrice),
            high: parseFloat(ticker.ticker.highPrice),
            mark: markPrice
        }
        redis.set('ORDERBOOK', JSON.stringify(result), 'EX', 1)
    }
}

function calculateFundingRate() {
    const indexPrice = index.price
    if (indexPrice && markPrice) {
        const premiumRate = (markPrice - indexPrice) / indexPrice
        return Math.max(0.0005, premiumRate) + Math.min(-0.0005, premiumRate)
    }
    return null
}

setInterval(() => {
    const fundingRate = calculateFundingRate()
    if (fundingRate) {
        redis.set('FUNDING_RATE', fundingRate, 'EX', 1)
    }
}, 100)
