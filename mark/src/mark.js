setInterval(calculateMarks, 1000)

async function calculateMarks() {
    const instruments = await getInstruments()
    instruments.forEach(async (instrument) => {
        const markPrice = await calculateMarkPrice(instrument)
        console.log(markPrice)
    })
}

async function calculateMarkPrice(instrument) {
    const orderbook = await getOrderbook(instrument)
    const index = await getIndex(instrument.index)

    const fairPrice = calculateFairPrice(orderbook)
    if (fairPrice === null) {
        return index
    }

    const ema = await calculateEMA(fairPrice)

    let markPrice = index + ema
    markPrice = limitMarkPriceByIndex(markPrice, index)
   
    return markPrice
}

function calculateEMA(price) {
    return 0
}

function limitMarkPriceByIndex(price, index) {
    price = Math.min(price, index + index * 0.005)
    price = Math.max(price, index - index * 0.005)
    return price
}

function calculateFairPrice(orderbook) {
    if (orderbook.bids.length === 0 && orderbook.asks.length === 0) {
        return null
    }

    const fairImpactBid = calculateFairImpactBid(orderbook)
    const fairImpactAsk = calculateFairImpactAsk(orderbook)
    return (fairImpactBid + fairImpactAsk) / 2
}

function calculateFairImpactBid(orderbook) {
    if (orderbook.bids.length === 0) {
        return null
    }
    const bestBidPrice = orderbook.bids[0].price
    const bidPrice = bestBidPrice - bestBidPrice * 0.001
    return bidPrice
}

function calculateFairImpactAsk(orderbook) {
    if (orderbook.asks.length === 0) {
        return null
    }
}

function getIndex(index) {
    return 104
}

function getInstruments() {
    return [
        {
            instrument: 'ETH-PERPETUAL',
            index: 'ETH'
        }
    ]

    /*
    {
        "kind": "future",
        "baseCurrency": "ETH",
        "currency": "USD",
        "minTradeSize": 1,
        "instrumentName": "ETH-PERPETUAL",
        "isActive": true,
        "settlement": "perpetual",
        "created": "2018-08-14 10:24:47 GMT",
        "tickSize": 0.25,
        "pricePrecision": 1,
        "expiration": "3000-01-01 08:00:00 GMT",
        "contractSize": 10
    }
    */
}

function getOrderbook(instrument) {
    return {
        asks: [
            {
                quantity: 1,
                price: 105
            },
            {
                quantity: 1,
                price: 106
            }
        ],
        bids: [
            {
                quantity: 1,
                price: 104
            },
            {
                quantity: 1,
                price: 103
            }
        ]
    }
}
