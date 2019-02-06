module.exports = class {
    constructor(broker, rabbit) {
        rabbit.consumeLastTrades((msg) => {
            broker.broadcast({
                event: 'lasttrade',
                data: msg
            })
        })
    }
}
