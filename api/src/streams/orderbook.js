const Binance = require('../binance')

module.exports = class {
    constructor(broker) {
        this.broker = broker
        this.binance = new Binance()
        setInterval(() => this.tick(), 1000)
    }

    async tick() {
        this.binance.depth('ETHUSDT').then(depth => {

        })
        this.broker.broadcast({
            stream: 'orderbook',
            data: {
                bids: [
                    {
                        qty: 100,
                        price: 101,
                        cm: 100
                    },
                    {
                        qty: 50,
                        price: 100.75,
                        cm: 150
                    },
                    {
                        qty: 50,
                        price: 100,
                        cm: 200
                    },
                    {
                        qty: 70,
                        price: 99.5,
                        cm: 270
                    },
                    {
                        qty: 130,
                        price: 99.25,
                        cm: 400
                    },
                    {
                        qty: 200,
                        price: 99,
                        cm: 600
                    }
                ],
                asks: [
                    {
                        qty: 100,
                        price: 101.5,
                        cm: 100
                    },
                    {
                        qty: 200,
                        price: 102.25,
                        cm: 300
                    },
                    {
                        qty: 50,
                        price: 102.5,
                        cm: 350
                    },
                    {
                        qty: 60,
                        price: 103,
                        cm: 410
                    },
                    {
                        qty: 100,
                        price: 104,
                        cm: 510
                    },
                    {
                        qty: 120,
                        price: 104.5,
                        cm: 630
                    }
                ],
                last: 108.20,
                low: 100.32,
                high: 110.52,
                mark: 100.53
            }
        })
    }
}
