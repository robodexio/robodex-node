const errors = require('./errors')

const express = require('express')
const app = express()

const morgan = require('morgan')
app.use(morgan('tiny'))

const UDF = require('./udf')
const udf = new UDF()

app.all('/', (req, res) => {
    res.set('Content-Type', 'text/plain').send('Welcome to the RoboDEX UDF Adapter for TradingView. See ./config for more details.')
})

app.get('/time', (req, res) => {
    const time = Math.floor(Date.now() / 1000)  // In seconds
    res.set('Content-Type', 'text/plain').send(time.toString())
})

function invoke(res, next, promise) {
    promise.then(result => {
        res.send(result)
    }).catch(err => {
        next(err)
    })
}

app.get('/config', (req, res, next) => {
    invoke(res, next, udf.config())
})

app.get('/symbol_info', (req, res, next) => {
    invoke(res, next, udf.symbolInfo())
})

app.get('/symbols', (req, res, next) => {
    invoke(res, next, udf.symbol(req.query.symbol))
})

app.get('/search', (req, res, next) => {
    invoke(res, next, udf.search(
        req.query.query,
        req.query.type,
        req.query.exchange,
        req.query.limit
    ))
})

app.get('/history', (req, res, next) => {
    invoke(res, next, udf.history(
        req.query.symbol,
        req.query.from,
        req.query.to,
        req.query.resolution
    ))
})

app.use((err, req, res, next) => {
    if (err instanceof errors.SymbolNotFound) {
        return res.status(404).send({
            s: 'error',
            errmsg: err.message
        })
    }

    console.error(err)

    res.status(500).send({
        s: 'error',
        errmsg: 'Internal Error'
    })
})

app.listen(80)
