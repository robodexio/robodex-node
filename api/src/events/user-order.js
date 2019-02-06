module.exports = class {
    constructor(broker, rabbit) {
        this.broker = broker
        rabbit.consumeUserOrders((msg) => {
            broker.send(msg.user, {
                event: 'order',
                data: msg.order
            })
        })
    }
}
