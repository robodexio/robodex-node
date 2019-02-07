module.exports = class {
    constructor(redis) {
        redis.get('ETH_INDEX').then(index => {
            this.index = JSON.parse(index)
        }).catch(err => {
            console.error(err)
        })
        redis.subscribe('ETH_INDEX')
        redis.on('message', (ch, msg) => {
            if (ch === 'ETH_INDEX') {
                this.index = JSON.parse(msg)
            }
        })
    }

    get price() {
        if (this.index) {
            return this.index.price 
        }
        return null
    }
}
