const request = require('request')

module.exports = class {
    constructor(symbol) {
        this.symbol = symbol
        this.name = 'binance'
        this.ask = null
        this.bid = null
        this.price = null
        this.updatedAt = null
        this.latency = null
    }

    get online() {
        if (this.updatedAt) {
            return Date.now() - this.updatedAt < 1000
        } else {
            return false
        }
    }

    start() {
        setInterval(() => this.load(), 500)
        this.load()
    }

    load() {
        const started = Date.now()
        this.bookTicker(this.symbol).then((ticker) => {
            this.latency = Date.now() - started

            this.ask = parseFloat(ticker.askPrice)
            this.bid = parseFloat(ticker.bidPrice)
            this.price = (this.ask + this.bid) / 2
            this.updatedAt = Date.now()
        }).catch((err) => {
            console.error(err)
        })
    }

    bookTicker(symbol) {
        // API Documentation: https://github.com/binance-exchange/binance-official-api-docs
        return new Promise((resolve, reject) => {
            request({
                url: 'https://api.binance.com/api/v3/ticker/bookTicker', 
                qs: {
                    symbol: symbol
                }
            }, (err, res, body) => {
                if (err) {
                    return reject(err)
                }
                if (!(res.statusCode >= 200 && res.statusCode <= 299)) {
                    return reject(new Error(body))
                }
                try {
                    resolve(JSON.parse(body))
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}
