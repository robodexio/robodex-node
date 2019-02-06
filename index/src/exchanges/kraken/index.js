const request = require('request')

module.exports = class {
    constructor(symbol) {
        this.symbol = symbol
        this.exchange = 'kraken'
        this.name = 'Kraken'
        this.price = null
        this.time = null

        setInterval(() => this.load(), 800)
        this.load()
    }

    get online() {
        if (this.time) {
            return Date.now() - this.time < 1600
        } else {
            return false
        }
    }

    load() {
        this.ticker(this.symbol).then((result) => {
            const ticker = result[this.symbol]
            const ask = parseFloat(ticker.a[0])
            const bid = parseFloat(ticker.b[0])
            this.price = (ask + bid) / 2
            this.time = Date.now()
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
