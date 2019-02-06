const request = require('request')

module.exports = class {
    constructor(symbol) {
        this.symbol = symbol
        this.exchange = 'gdax'
        this.name = 'GDAX'
        this.price = null
        this.time = null

        setInterval(() => this.load(), 1000)
        this.load()
    }

    get online() {
        if (this.time) {
            return Date.now() - this.time < 2000
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

    ticker(product) {
        return new Promise((resolve, reject) => {
            request({
                url: `https://api.pro.coinbase.com/products/${product}/ticker`,
                headers: {
                    'User-Agent': 'RoboDEX'
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
