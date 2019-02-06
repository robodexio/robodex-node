module.exports = class {
    constructor(broker) {
        setInterval(() => {
            broker.broadcast({
                stream: 'time',
                data: Date.now()
            })
        }, 1000)
    }
}
