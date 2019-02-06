module.exports = class {
    constructor(broker, redis) {
        this.broker = broker
        setInterval(() => this.tick(), 1000)
    }

    async tick() {
        this.broker.broadcast({
            stream: 'funding',
            data: 0.05
        })
    }
}
