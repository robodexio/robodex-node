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

    console.log('Fair Price:', fairPrice)

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
    if (orderbook.bids.length === 0 || orderbook.asks.length === 0) {
        return null
    }

    const fairImpactBid = calculateFairImpactBid(orderbook)
    const fairImpactAsk = calculateFairImpactAsk(orderbook)
    return (fairImpactBid + fairImpactAsk) / 2
}

function calculateFairImpactBid(orderbook) {
    const avgBidPriceIn10000 = calculateAvgPriceForQuantity(10000, orderbook.bids).price

    const bestBidPrice = orderbook.bids[0].price
    const bidPrice = bestBidPrice - bestBidPrice * 0.001
    
    return Math.max(avgBidPriceIn10000, bidPrice)
}

function calculateFairImpactAsk(orderbook) {
    const avgAskPriceIn10000 = calculateAvgPriceForQuantity(10000, orderbook.asks).price

    const bestAskPrice = orderbook.asks[0].price
    const askPrice = bestAskPrice + bestAskPrice * 0.001
    
    return Math.min(avgAskPriceIn10000, askPrice)
}

function calculateAvgPriceForQuantity(quantity, side) {
    let totalQuantity = 0
    let totalPower = 0

    for (level of side) {
        let takedQuantity = level.quantity

        if (totalQuantity + takedQuantity > quantity) {
            takedQuantity = quantity - totalQuantity
        }

        totalQuantity += takedQuantity
        totalPower += takedQuantity * level.price

        if (totalQuantity === quantity) {
            break
        }
    }

    return {
        quantity: totalQuantity,
        price: totalPower / totalQuantity
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
