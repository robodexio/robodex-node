module.exports = class {
    constructor(broker, rabbit) {
        rabbit.consumeUserOrders((msg) => {
            broker.send(msg.user, {
                event: 'order',
                data: msg.order
            })
        })
    }
}
