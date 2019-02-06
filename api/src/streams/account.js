module.exports = class {
    constructor(broker) {
        this.broker = broker
        setInterval(() => this.tick(), 1000)
    }

    async tick() {
        this.broker.broadcast({
            stream: 'account',
            data: {
                equity: 32.4020323,
                availableFunds: 4.328582,
                marginBalance: 50.20302,
                initialMargin: 4.32030,
                maintenanceMargin: 3.88592
            }
        })
    }
}
