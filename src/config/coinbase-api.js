
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
            return [null, res.data]
        })
        .catch((error) => {
            console.log(error)
            return [walletError, null]
        });
}


async function getCoinbaseWalletFromAPI(apiKey, secret) {
    try {
        let coinbase = new ccxt.coinbase({ apiKey, secret })
        const balance = await coinbase.fetchBalance();
        return [null, balance];
    } catch (err) {
        return [err, null]
    }
}


module.exports = {
    getCoinbaseWalletFromOauth,
    getCoinbaseWalletFromAPI,
}