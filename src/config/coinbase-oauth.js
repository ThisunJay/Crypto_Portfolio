
const querystring = require("query-string");
const axios = require("axios");

function getCoinBaseAuthURL() {
    const rootUrl = "https://www.coinbase.com/oauth/authorize";
    const options = {
        redirect_uri: `${process.env.SERVER_ROOT_URI}/auth/coinbase`,
        client_id: process.env.COINBASE_AUTH_CLIENT,
        response_type: "code",
        scope: [
            "wallet:user:read",
            "wallet:accounts:read",
            "wallet:transactions:read"
        ].join(" "),
    };
    return `${rootUrl}?${querystring.stringify(options)}`;
}

function getCoinBaseTokens(code) {
    const url = "https://api.coinbase.com/oauth/token";
    const values = {
        code,
        client_id: process.env.COINBASE_AUTH_CLIENT,
        client_secret: process.env.COINBASE_AUTH_SECRET,
        redirect_uri: `${process.env.SERVER_ROOT_URI}/auth/coinbase`,
        grant_type: "authorization_code",
    };

    return axios.post(url, querystring.stringify(values), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((res) => {
            return [null, res.data]
        })
        .catch((error) => {
            console.log(error)
            return [error, null]
        });
}
function getCoinbaseWallet(req) {
    const url = "https://api.coinbase.com/v2/accounts";
    let auth_details = req.session.cookie;
    console.log(auth_details);

    return axios.get(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${auth_details.access_token}`
        },
    })
        .then((res) => {
            let walletDetails = red.data
            return [null, walletDetails]
        })
        .catch((error) => {
            // console.log(error)
            let walletError = error
            return [walletError, null]
        });
}

function getCoinMarketDefault() {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
    const params = {
        cryptocurrency_type: "coins",
        limit: "10",
        CMC_PRO_API_KEY: "21dc2e18-3e7b-4d3f-83eb-5bea063644cc",
    };

    return axios.get(url, { params })
        .then((res) => {
            return [null, res.data.data]
        })
        .catch((error) => {
            console.log(error)
            return [error, null]
        });
}

module.exports = {
    getCoinBaseAuthURL,
    getCoinBaseTokens,
    getCoinbaseWallet,
    getCoinMarketDefault
}