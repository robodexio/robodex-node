const request = require('request')

module.exports = class {
    constructor(symbol) {
        this.symbol = symbol
        this.exchange = 'gemini'
        this.name = 'Gemini'
        this.price = null
        this.time = null

        setInterval(() => this.load(), 900)
        this.load()
    }

    get online() {
        if (this.time) {
            return Date.now() - this.time < 1800
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

    ticker(symbol) {
        return new Promise((resolve, reject) => {
            request(`https://api.gemini.com/v1/pubticker/${symbol}`, (err, res, body) => {
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
