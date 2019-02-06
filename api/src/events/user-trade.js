module.exports = class {
    constructor(broker) {
        this.broker = broker
        rabbit.consumeUserTrades((msg) => {
            broker.send(msg.user, {
                event: 'trade',
                data: msg.trade
            })
        })
    }
}
