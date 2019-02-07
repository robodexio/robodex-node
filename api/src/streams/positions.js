module.exports = class {
    constructor(broker) {
        this.broker = broker
        setInterval(() => this.tick(), 1000)
    }

    async tick() {
        this.broker.broadcast({
            stream: 'positions',
            data: [
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
        })
    }
}
