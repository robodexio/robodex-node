const request = require('request')

module.exports = class {
    klines(symbol, interval, startTime, endTime, limit) {
        return this.request('/api/v1/klines', { qs: { symbol, interval, startTime, endTime, limit } })
    }

    request(path, options) {
        return new Promise((resolve, reject) => {
            request('https://api.binance.com' + path, options, (err, res, body) => {
                if (err) {
                    return reject(err)
                }
                if (!body) {
                    return reject(new Error('No body'))
                }

                try {
                    const json = JSON.parse(body)
                    if (json.code && json.msg) {
                        const err = new Error(json.msg)
                        err.code = json.code
                        return reject(err)
                    }
                    return resolve(json)
                } catch (err) {
                    return reject(err)
                }
            })
        })
    }
}
