
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


module.exports = {
    getCoinBaseAuthURL,
    getCoinBaseTokens,
}