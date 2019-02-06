const request = require('request')

module.exports = class {
    constructor(symbol) {
        this.symbol = symbol
        this.exchange = 'bitstamp'
        this.name = 'Bitstamp'
        this.price = null
        this.time = null

        setInterval(() => this.load(), 1100)
        this.load()
    }

    get online() {
        if (this.time) {
            return Date.now() - this.time < 2200
        } else {
            return false
        }
    }

    load() {
        this.ticker(this.symbol).then((ticker) => {
            const ask = parseFloat(ticker.ask)
            const bid = parseFloat(ticker.bid)
            this.price = (ask + bid) / 2
            this.time = Date.now()
        }).catch((err) => {
            console.error(err)
        })
    }

    ticker(pair) {
        // API Documentation: https://www.bitstamp.net/api/
        return new Promise((resolve, reject) => {
            request({
                url: `https://www.bitstamp.net/api/v2/ticker/${pair}`
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
