const axios = require("axios");

function storeUserInforFromGoogle(req, res, data) {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${data.access_token}`;
    return axios.get(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((result) => {
            req.session.user_session = {
                user_info: result.data,
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
                res.redirect('/')
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
            req.session.user_session = {
                user_info: result.data.data,
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
                res.redirect('/')
            })
        })
        .catch((error) => {
            res.redirect('/login')
        });
}

module.exports = {
    storeUserInforFromGoogle,
    storeUserInforFromCoinbase
}

