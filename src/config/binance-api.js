const ccxt = require('ccxt')

async function getBinanceWalletFromAPI(apiKey, secret) {
    try {
        let binance = new ccxt.binance({ apiKey, secret })
        const balance = await binance.fetchBalance();
        return [null, balance];
    } catch (err) {
        return [err, null]
    }
}


module.exports = {
    getBinanceWalletFromAPI,
}