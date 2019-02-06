const errors = require('./errors')
const Binance = require('./binance')

module.exports = class {
    constructor() {
        this.supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', '360', '480', '720', '1D', '3D', '1W', '1M']
        this.symbols = [{
            symbol: 'ETH-PERPETUAL',
            name: 'ETH-PERPETUAL',
            full_name: 'ETH-PERPETUAL',
            ticker: 'ETH-PERPETUAL',
            description: 'ETH-PERPETUAL: Etherium / US Dollar Perpetual Inverse Swap Contract',
            exchange: 'ROBODEX',
            listed_exchange: 'ROBODEX',
            exchange: 'ROBODEX',
            type: 'crypto',
            session: '24x7',
            timezone: 'UTC',
            currency_code: 'USD',
            supported_resolutions: this.supportedResolutions,
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true,
            minmov: 1,
            pricescale: 2,
            data_status: 'streaming'
        }]
        this.binance = new Binance()
    }

    async config() {
        return {
            exchanges: [
                {
                    value: 'ROBODEX',
                    name: 'RoboDEX',
                    desc: 'RoboDEX — derivatives DEX'
                }
            ],
            symbols_types: [
                {
                    value: 'crypto',
                    name: 'Cryptocurrency'
                }
            ],
            supported_resolutions: this.supportedResolutions,
            supports_marks: false,
            supports_timescale_marks: false,
            supports_group_request: false,
            supports_search: true,
            supports_time: true
        }
    }

    async symbolInfo() {
        return this.asTable(this.symbols)
    }

    asTable(items) {
        let result = {}
        for (const item of items) {
            for (const key in item) {
                if (!result[key]) {
                    result[key] = []
                }
                result[key].push(item[key])
            }
        }
        for (const key in result) {
            const values = [...new Set(result[key])]
            if (values.length === 1) {
                result[key] = values[0]
            }
        }
        return result
    }

    async symbol(symbol) {
        const comps = symbol.split(':')
        const s = (comps.length > 1 ? comps[1] : symbol).toUpperCase()

        for (const symbol of this.symbols) {
            if (symbol.symbol === s) {
                return symbol
            }
        }

        throw new errors.SymbolNotFound('Not Found')
    }

    async search(query, type, exchange, limit) {
        let symbols = this.symbols
        if (type) {
            symbols = symbols.filter(s => s.type === type)
        }
        if (exchange) {
            symbols = symbols.filter(s => s.exchange === exchange)
        }

        query = query.toUpperCase()
        symbols = symbols.filter(s => s.symbol.indexOf(query) >= 0)

        if (limit) {
            symbols = symbols.slice(0, limit)
        }
        return symbols.map(s => ({
            symbol: s.symbol,
            full_name: s.full_name,
            description: s.description,
            exchange: s.exchange,
            ticker: s.ticker,
            type: s.type
        }))
    }

    async history(symbol, from, to, resolution) {
        const RESOLUTIONS_INTERVALS_MAP = {
            '1': '1m',
            '3': '3m',
            '5': '5m',
            '15': '15m',
            '30': '30m',
            '60': '1h',
            '120': '2h',
            '240': '4h',
            '360': '6h',
            '480': '8h',
            '720': '12h',
            'D': '1d',
            '1D': '1d',
            '3D': '3d',
            'W': '1w',
            '1W': '1w',
            'M': '1M',
            '1M': '1M',
        }

        const interval = RESOLUTIONS_INTERVALS_MAP[resolution]
        let totalKlines = []

        from *= 1000
        to *= 1000

        while (true) {
            const klines = await this.binance.klines('ETHUSDT', interval, from, to, 500)
            totalKlines = totalKlines.concat(klines)
            if (klines.length == 500) {
                from = klines[klines.length - 1][0] + 1
            } else {
                if (totalKlines.length === 0) {
                    return { s: 'no_data' }
                } else {
                    return {
                        s: 'ok',
                        t: totalKlines.map(b => Math.floor(b[0] / 1000)),
                        c: totalKlines.map(b => parseFloat(b[4])),
                        o: totalKlines.map(b => parseFloat(b[1])),
                        h: totalKlines.map(b => parseFloat(b[2])),
                        l: totalKlines.map(b => parseFloat(b[3])),
                        v: totalKlines.map(b => parseFloat(b[5]))
                    }
                }
            }
        }
    }
}