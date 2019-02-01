const request = require('request')

module.exports = class {
    constructor(symbol) {
        this.symbol = symbol
        this.name = 'bitstamp'
        this.ask = null
        this.bid = null
        this.price = null
        this.updatedAt = null
        this.latency = null
    }

    get online() {
        if (this.updatedAt) {
            return Date.now() - this.updatedAt < 2200
        } else {
            return false
        }
    }

    start() {
        setInterval(() => this.load(), 1100)
        this.load()
    }

    load() {
        const started = Date.now()
        this.ticker(this.symbol).then((ticker) => {
            this.latency = Date.now() - started

            this.ask = parseFloat(ticker.ask)
            this.bid = parseFloat(ticker.bid)
            this.price = (this.ask + this.bid) / 2
            this.updatedAt = Date.now()
        }).catch((err) => {
            console.error(err)
        })
    }

    ticker(pair) {
        // API Documentation: https://www.bitstamp.net/api/
        return new Promise((resolve, reject) => {
            request({
                url: `https://www.bitstamp.net/api/v2/ticker/${this.symbol}`
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
