const amqp = require('amqplib')

module.exports = class {
    constructor(url) {
        this.connection = amqp.connect(url)
    }

    consumeLastTrades(handler) {
        return this.consume('api-last-trades', handler)
    }

    consumeUserTrades(handler) {
        return this.consume('api-user-trades', handler)
    }

    consumeUserOrders(handler) {
        return this.consume('api-user-orders', handler)
    }

    async consume(queue, handler) {
        const connection = await this.connection
        const channel = await connection.createChannel()
        await channel.assertExchange(queue, 'fanout', { durable: false })
        const qok = await channel.assertQueue('', { exclusive: true })
        await channel.bindQueue(qok.queue, queue, '')
        channel.consume(qok.queue, msg => this.handle(msg, handler), { noAck: true })
    }

    handle(message, handler) {
        try {
            handler(JSON.parse(message.content))
        } catch (err) {
            console.error(err)
        }
    }
}
