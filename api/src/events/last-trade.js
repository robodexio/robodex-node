module.exports = class {
    constructor(broker, rabbit) {
        this.broker = broker
        rabbit.consumeLastTrades((msg) => {
            broker.broadcast({
                event: 'lasttrade',
                data: msg
            })
        })
    }
}
