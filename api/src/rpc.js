module.exports = class {
    constructor() {
        this.orderbook = this.orderbook.bind(this)
        this.lastTrades = this.lastTrades.bind(this)
        this.auth = this.auth.bind(this)
        this.buy = this.buy.bind(this)
        this.sell = this.sell.bind(this)
        this.cancel = this.cancel.bind(this)
        this.positions = this.positions.bind(this)
        this.openOrders = this.openOrders.bind(this)
        this.orderHistory = this.orderHistory.bind(this)
        this.tradeHistory = this.tradeHistory.bind(this)
    }

    async orderbook(params) {
        return {}
    }

    async lastTrades(params) {
        return {}
    }

    async auth(params) {
        return {}
    }

    async buy(params) {
        return {}
    }

    async sell(params) {
        return {}
    }

    async cancel(params) {
        return {}
    }

    async positions(params) {
        return {}
    }

    async openOrders(params) {
        return {}
    }

    async orderHistory(params) {
        return {}
    }

    async tradeHistory(params) {
        return {}
    }
}
