const axios = require("axios");

function storeUserInforFromGoogle(req, res, data) {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${data.access_token}`;
    return axios.get(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((result) => {
            const user = result.data;
            req.session.user_session = {
                user_info: {
                    name: user.name,
                    email: user.email,
                    image: user.picture
                },
                access_token: data.access_token ? data.access_token : null,
                refresh_token: data.refresh_token ? data.refresh_token : null,
                scope: data.scope ? data.scope : null,
                method: "GOOGLE",
                api_key: null
            }
            req.session.save(function (err) {
                if (err) {
                    res.redirect('/login')
                }
                res.redirect('/select-wallet')
            })
        })
        .catch((error) => {
            res.redirect('/login')
        });
}

function storeUserInforFromCoinbase(req, res, data) {
    const url = `https://api.coinbase.com/v2/user`;
    return axios.get(url, {
        headers: {
            "Authorization": `Bearer ${data.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((result) => {
            const user = result.data.data
            req.session.user_session = {
                user_info: {
                    name: user.name,
                    email: "",
                    image: user.avatar_url
                },
                access_token: data.access_token ? data.access_token : null,
                refresh_token: data.refresh_token ? data.refresh_token : null,
                scope: data.scope ? data.scope : null,
                is_athenticate: true,
                method: "COINBASE",
                api_key: null
            }
            req.session.save(function (err) {
                if (err) {
                    res.redirect('/login')
                }
                res.redirect('/dashboard')
            })
        })
        .catch((error) => {
            res.redirect('/login')
        });
}

function getCoinMarketDefault(limit = 7) {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
    const params = {
        cryptocurrency_type: "coins",
        limit,
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

function setupLocalValues(req, res, next) {
    let info = req.session?.user_session?.user_info;
    res.locals.values = {
        query: req.query,
        user_info: info ? info : null
    }
    next();
}

module.exports = {
    storeUserInforFromGoogle,
    storeUserInforFromCoinbase,
    getCoinMarketDefault,
    setupLocalValues
}

