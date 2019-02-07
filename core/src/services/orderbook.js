const Binance = require('../binance')

module.exports = class {
    constructor() {
        this.binance = new Binance()

        setInterval(() => this.loadDepth(), 600)
        this.loadDepth()
    }

    loadDepth() {
        function side(levels) {
            levels = levels.map(level => ({
                price: parseFloat(level[0]),
                qty: parseInt(parseFloat(level[0]) * parseFloat(level[1]))
            })).filter(l => l.qty > 0)
            
            let cm = 0
            levels.forEach(level => {
                level.cm = cm + level.qty
                cm = level.cm
            })

            return levels
        }

        this.binance.depth('ETHUSDT').then(depth => {
            this.asks = side(depth.asks)
            this.bids = side(depth.bids)
        }).catch(err => {
            console.error(err)
        })
    }

    get fairPrice() {
        const bid = this.fairImpactBid
        const ask = this.fairImpactAsk
        if (bid && ask) {
            return (bid + ask) / 2
        }
        return null
    }

    get fairImpactBid() {
        if (this.bids && this.bids[0]) {
            const price = this.bids[0].price
            return price - 0.001 * price
        }
        return null
    }

    get fairImpactAsk() {
        if (this.asks && this.asks[0]) {
            const price = this.asks[0].price
            return price + 0.001 * price
        }
        return null
    }
}
