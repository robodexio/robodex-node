const request = require('request')

module.exports = class {
    klines(symbol, interval, startTime, endTime, limit) {
        return this.request('/api/v1/klines', { qs: { symbol, interval, startTime, endTime, limit } })
    }

    depth(symbol) {
        return this.request('/api/v1/depth', { qs: { symbol } })
    }

    trades(symbol) {
        return this.request('/api/v1/trades', { qs: { symbol } })
    }

    ticker(symbol) {
        return this.request('/api/v1/ticker/24hr', { qs: { symbol } })
    }

    request(path, options) {
        return new Promise((resolve, reject) => {
            request('https://api.binance.com' + path, options, (err, res, body) => {
                if (err) return reject(err)

                try {
                    const json = JSON.parse(body)
                    if (json.code) return reject(new Error(`${json.code}: ${json.msg}`))
                    resolve(json)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}
