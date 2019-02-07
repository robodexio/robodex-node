const Binance = require('../binance')

module.exports = class {
    constructor() {
        this.binance = new Binance()
        
        setInterval(() => this.loadTicker(), 1000)
        this.loadTicker()
    }

    loadTicker() {
        this.binance.ticker('ETHUSDT').then(ticker => {
            this.ticker = ticker
        }).catch(err => {
            console.error(err)
        })
    }
}
