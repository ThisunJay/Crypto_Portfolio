
const querystring = require("query-string");
const axios = require("axios");

function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${process.env.SERVER_ROOT_URI}/auth/google`,
        client_id: process.env.GOOGLE_AUTH_CLIENT,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
}

function getGoogleTokens(code) {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: process.env.GOOGLE_AUTH_CLIENT,
        client_secret: process.env.GOOGLE_AUTH_SECRET,
        redirect_uri: `${process.env.SERVER_ROOT_URI}/auth/google`,
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
            return [error, null]
        });
}

module.exports = {
    getGoogleAuthURL,
    getGoogleTokens
}

