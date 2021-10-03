
const axios = require("axios");
const ccxt = require('ccxt')

function getCoinbaseWalletFromOauth(req) {
    const url = "https://api.coinbase.com/v2/accounts";
    let auth_details = req.session.user_session;
    console.log(auth_details);

    return axios.get(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${auth_details.access_token}`
        },
    })
        .then((res) => {
            return [null, formatDataset(res.data)];
        })
        .catch((error) => {
            console.log(error)
            return [walletError, null]
        });
}


async function getCoinbaseWalletFromAPI(apiKey, secret) {
    try {
        let coinbase = new ccxt.coinbase({ apiKey, secret })
        const results = await coinbase.fetchBalance();
        return [null, formatDataset(results)];
    } catch (err) {
        return [err, null]
    }
}

function formatDataset(results) {
    let coins = results.free;
    let dataset = [];
    for (const key in coins) {
        if (coins[key] > 0) {
            dataset.push({
                value: Number(coins[key]),
                symbol: key
            })
        }
    }
    return dataset;
}


module.exports = {
    getCoinbaseWalletFromOauth,
    getCoinbaseWalletFromAPI,
}