module.exports = class {
    constructor(broker) {
        this.broker = broker
        setInterval(() => this.tick(), 1000)
    }

    async tick() {
        this.broker.broadcast({
            stream: 'positions',
            data: [
            ]
        })
    }
}
