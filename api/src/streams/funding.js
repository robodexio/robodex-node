module.exports = class {
    constructor(broker, redis) {
        this.broker = broker
        this.redis = redis
        setInterval(() => this.tick(), 1000)
    }

    async tick() {
        try {
            let funding = await this.redis.get('FUNDING_RATE')
            if (funding) {
                this.broker.broadcast({
                    stream: 'funding',
                    data: funding
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
}
