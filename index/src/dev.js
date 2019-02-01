const Provider = require('./exchanges/kraken')
const provider = new Provider('XETHZUSD')
provider.start()
