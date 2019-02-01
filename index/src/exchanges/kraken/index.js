const request = require('request')

module.exports = class {
    constructor(symbol) {
        this.symbol = symbol
        this.name = 'kraken'
        this.ask = null
        this.bid = null
        this.price = null
        this.updatedAt = null
        this.latency = null
    }

    get online() {
        if (this.updatedAt) {
            return Date.now() - this.updatedAt < 1600
        } else {
            return false
        }
    }

    start() {
        setInterval(() => this.load(), 800)
        this.load()
    }

    load() {
        const started = Date.now()
        this.ticker(this.symbol).then((result) => {
            this.latency = Date.now() - started
            
            const ticker = result[this.symbol]
            this.ask = parseFloat(ticker.a[0])
            this.bid = parseFloat(ticker.b[0])
            this.price = (this.ask + this.bid) / 2
            this.updatedAt = Date.now()
        }).catch((err) => {
            console.error(err)
        })
    }

    ticker(pair) {
        // API Documentation: https://www.kraken.com/features/api
        return new Promise((resolve, reject) => {
            request({
                url: 'https://api.kraken.com/0/public/Ticker', 
                qs: {
                    pair: pair
                }
            }, (err, res, body) => {
                if (err) {
                    return reject(err)
                }
                try {
                    const json = JSON.parse(body)
                    if (json.result) {
                        resolve(json.result)
                    } else {
                        reject(new Error(json.error))
                    }
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}
