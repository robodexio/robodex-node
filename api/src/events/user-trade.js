module.exports = class {
    constructor(broker, rabbit) {
        rabbit.consumeUserTrades((msg) => {
            broker.send(msg.user, {
                event: 'trade',
                data: msg.trade
            })
        })
    }
}
