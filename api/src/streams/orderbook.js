module.exports = class {
    constructor(broker, redis) {
        this.broker = broker
        this.redis = redis
        setInterval(() => this.tick(), 1000)
    }

    async tick() {
        try {
            let orderbook = await this.redis.get('ORDERBOOK')
            if (orderbook) {
                orderbook = JSON.parse(orderbook)
                this.broker.broadcast({
                    stream: 'orderbook',
                    data: orderbook
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
}
