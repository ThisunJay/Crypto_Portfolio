const axios = require("axios");
function storeTokens(req, data) {

    const session_object = {
        ...req.session.cookie,
        user_info: null,
        access_token: data.access_token ? data.access_token : null,
        refresh_token: data.refresh_token ? data.refresh_token : null,
        scope: data.scope ? data.scope : null,
        is_athenticate: true,
        method: data.method ? data.method : null
    }

    req.session.cookie = session_object;

    return req;
}
function storeUserInforFromGoogle(req) {
    let auth_details = req.session.cookie;
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${auth_details.access_token}`;
    return axios.get(url, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((res) => {
            const userData = res.data;
            req.session.cookie.user_info = userData
            return [null, res.data]
        })
        .catch((error) => {
            return [error, null]
        });
}

function storeUserInforFromCoinbase(req) {
    let auth_details = req.session.cookie;
    const url = `https://api.coinbase.com/v2/user`;
    return axios.get(url, {
        headers: {
            "Authorization": `Bearer ${auth_details.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((res) => {
            // console.log("RES: ", res.data.data);
            const userData = res.data.data;
            req.session.cookie.user_info = userData
            return [null, null]
        })
        .catch((error) => {
            return [error, null]
        });
}

module.exports = {
    storeTokens,
    storeUserInforFromGoogle,
    storeUserInforFromCoinbase
}

