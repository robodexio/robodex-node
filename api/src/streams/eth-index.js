module.exports = class {
    constructor(broker, redis) {
        this.broker = broker
        this.redis = redis
        setInterval(() => this.tick(), 1000)
    }

    async tick() {
        try {
            let index = await this.redis.get('ETH_INDEX')
            if (index) {
                index = JSON.parse(index)
                this.broker.broadcast({
                    stream: 'index',
                    data: index
                })
            }
        } catch (err) {
            console.error(err)
        }
    }
}
