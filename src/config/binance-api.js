const ccxt = require('ccxt')

async function getBinanceWalletFromAPI(apiKey, secret) {
    try {
        let binance = new ccxt.binance({ apiKey, secret })
        const results = await binance.fetchBalance();
        let balances = (results?.info?.balances) ? results.info.balances : [];
        balances = balances.reduce((acc, current) => {
            if (current.free > 0) {
                acc.push({
                    value: Number(current.free),
                    symbol: current.asset
                })
            }
            return acc;
        }, [])

        return [null, balances];
    } catch (err) {
        return [err, null]
    }
}


module.exports = {
    getBinanceWalletFromAPI,
}