const Binance = require('./binance');

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

        this.binance = new Binance()
    }

    async orderbook(params) {
        return {}
    }

    async lastTrades(params) {
        return this.binance.trades('ETHUSDT').then(trades => {
            return trades.map((trade) => ({
                direction: trade.isBuyerMaker ? 'sell' : 'buy',
                quantity: parseInt(parseFloat(trade.qty) * parseFloat(trade.price)),
                price: parseFloat(trade.price),
                time: trade.time
            })).filter(t => t.quantity > 0).reverse()
        })
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
        return [
            {
              size: -5020,
              sizeEth: -40.40402,
              avgPrice: 108.32,
              profitLoss: -0.434,
              maintenanceMargin: 3.2323,
              initialMargin: 4.2302,
              markPrice: 104.23,
              realizedPl: 0.323,
              floatingPl: -0.323,
            },
            {
              size: 120,
              sizeEth: 1.34534,
              avgPrice: 108.32,
              maintenanceMargin: 3.2323,
              initialMargin: 4.2302,
              markPrice: 104.23,
              profitLoss: 0.64,
              realizedPl: 0.323,
              floatingPl: 0.323,
            },
            {
              size: 4020,
              sizeEth: 32.233939,
              avgPrice: 108.32,
              maintenanceMargin: 3.2323,
              initialMargin: 4.2302,
              markPrice: 104.23,
              profitLoss: 0.334,
              realizedPl: -0.323,
              floatingPl: 0.323,
            }
          ]
    }

    async openOrders(params) {
        return [
            {
                direction: 'sell',
                avgPrice: 108.32,
                quantity: 3202,
                filledQuantity: 402,
                type: 'market',
                time: Date.now(),
                status: 'filled',
            },
            {
                direction: 'buy',
                avgPrice: 108.32,
                quantity: 3202,
                filledQuantity: 402,
                type: 'market',
                time: Date.now(),
                status: 'open',
            },
            {
                direction: 'sell',
                avgPrice: 108.32,
                quantity: 3202,
                filledQuantity: 402,
                type: 'limit',
                time: Date.now(),
                status: 'filled',
                price: 108.42
            },
            {
                direction: 'sell',
                avgPrice: 108.32,
                quantity: 3202,
                filledQuantity: 402,
                type: 'market',
                time: Date.now(),
                status: 'open',
            }
        ]
    }

    async orderHistory(params) {
        return [
            {
                direction: 'sell',
                avgPrice: 108.32,
                quantity: 3202,
                filledQuantity: 402,
                type: 'market',
                time: Date.now(),
                status: 'filled',
            },
            {
                direction: 'buy',
                avgPrice: 108.32,
                quantity: 3202,
                filledQuantity: 402,
                type: 'market',
                time: Date.now(),
                status: 'open',
            },
            {
                direction: 'sell',
                avgPrice: 108.32,
                quantity: 3202,
                filledQuantity: 402,
                type: 'limit',
                time: Date.now(),
                status: 'filled',
                price: 108.42
            },
            {
                direction: 'sell',
                avgPrice: 108.32,
                quantity: 3202,
                filledQuantity: 402,
                type: 'market',
                time: Date.now(),
                status: 'open'
            }
        ]
    }

    async tradeHistory(params) {
        return [
            {
                quantity: 3232,
                price: 108.30,
                direction: 'buy',
                type: 'limit',
                time: Date.now()
            },
            {
                quantity: 3232,
                price: 108.30,
                direction: 'sell',
                type: 'limit',
                time: Date.now()
            },
            {
                quantity: 3232,
                price: 108.30,
                direction: 'buy',
                type: 'market',
                time: Date.now()
            }
        ]
    }
}
