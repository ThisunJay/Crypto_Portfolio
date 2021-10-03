// OAuth
const { getGoogleAuthURL, getGoogleTokens } = require('../config/google-oauth');
const { getCoinBaseAuthURL, getCoinBaseTokens } = require('../config/coinbase-oauth');

// Util Functions
const { storeUserInforFromCoinbase, storeUserInforFromGoogle, getCoinMarketDefault } = require('../config/util');

// Wallets 
const { getCoinbaseWalletFromAPI, getCoinbaseWalletFromOauth } = require('../config/coinbase-api');
const { getBinanceWalletFromAPI } = require('../config/binance-api');

const ccxt = require('ccxt')
const dayjs = require('dayjs')

exports.defaultRoute = async (req, res) => {
    // const [err, results] = await getCoinMarketDefault(5);
    let data = [];
    // if (!err) { data = results }
    console.log(req.session.user_session)
    res.render('dashboard', { data });
}

exports.login = async (req, res) => {
    const urls = {
        google: getGoogleAuthURL(),
        coinbase: getCoinBaseAuthURL(),
    }
    res.render('login', { urls });
}

exports.selectWallet = async (req, res) => {
    // const [err, results] = await getCoinMarketDefault();
    let data = [];
    // if (!err) { data = results }
    res.render('select-wallet', { data });
}

exports.googleAuth = async (req, res) => {
    const { code } = req.query;
    const [error, data] = await getGoogleTokens(code);
    if (error) { res.redirect('/login') }
    await storeUserInforFromGoogle(req, res, data);
}

exports.coinbaseAuth = async (req, res) => {
    const { code } = req.query;
    const [error, data] = await getCoinBaseTokens(code);
    if (error) { res.redirect('/login') }
    await storeUserInforFromCoinbase(req, res, data);

}

exports.walletAPIConfirm = async (req, res) => {
    const { apiKey, secret, type } = req.body;
    let errMsg = null;

    if (type == "COINBASE") {
        const [error, results] = await getCoinbaseWalletFromAPI(apiKey, secret);
        if (error) { errMsg = encodeURIComponent("Coinbase API Key Invaid - Authentication Failed") }
    } else if (type == "BINANCE") {
        const [error, results] = await getBinanceWalletFromAPI(apiKey, secret);
        if (error) { errMsg = encodeURIComponent("Binance API Key Invaid - Authentication Failed") }
    } else {
        errMsg = encodeURIComponent("Authentication Faild")
    }

    if (errMsg) {
        res.redirect("/select-wallet?e=" + errMsg)
    } else {
        req.session.user_session.api_key = {
            apiKey, secret, type
        }
        res.redirect('/dashboard')
    }

}


exports.logout = async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}

exports.test = async (req, res) => {
    const exchange = new ccxt.binance({ 'enableRateLimit': true })
    const timeframe = '1d'
    const symbol = 'BTC/USDT'

    // Download historical data
    let historical = await exchange.fetchOHLCV(symbol, timeframe, undefined, 14)
    historical = historical.map(item => {
        return {
            time: dayjs(item[0]).format(),
            value: item[1]
        }
    })
    console.log(historical)
    res.send(historical);
}


// OAuth
const { getGoogleAuthURL, getGoogleTokens } = require('../config/google-oauth');
const { getCoinBaseAuthURL, getCoinBaseTokens } = require('../config/coinbase-oauth');

// Util Functions
const { storeUserInforFromCoinbase, generateDashboardData,
    storeUserInforFromGoogle, getCoinMarketDefault } = require('../config/util');

// Wallets 
const { getCoinbaseWalletFromAPI, getCoinbaseWalletFromOauth } = require('../config/coinbase-api');
const { getBinanceWalletFromAPI } = require('../config/binance-api');


exports.defaultRoute = async (req, res) => {
    const [err, results] = await getCoinMarketDefault(5);
    const driveUploadLink = await getGoogleAuthURL(true);

    let data = [];
    if (!err) { data = results }

    const sessionData = req.session.user_session
    if (sessionData.method == "GOOGLE" && sessionData.api_key != null) {
        if (sessionData.api_key.type == "BINANCE") {
            [err2, rs] = await getBinanceWalletFromAPI(sessionData.api_key.apiKey, sessionData.api_key.secret)
            const dashboard = await generateDashboardData(rs.length > 0 ? rs : defaultData)
            res.render('dashboard', { data, ...dashboard, driveUploadLink });
        } else {
            [err2, rs] = await getCoinbaseWalletFromAPI(sessionData.api_key.apiKey, sessionData.api_key.secret)
            const dashboard = await generateDashboardData(rs.length > 0 ? rs : defaultData)
            res.render('dashboard', { data, ...dashboard, driveUploadLink });
        }
    } else if (sessionData.method == "COINBASE") {
        [err2, rs] = await getCoinbaseWalletFromOauth(req)
        const dashboard = await generateDashboardData(rs.length > 0 ? rs : defaultData)
        res.render('dashboard', { data, ...dashboard, driveUploadLink });

    } else {
        res.redirect("/select-wallet")
    }
}

exports.login = async (req, res) => {
    const urls = {
        google: getGoogleAuthURL(),
        coinbase: getCoinBaseAuthURL(),
    }
    res.render('login', { urls });
}

exports.selectWallet = async (req, res) => {
    const [err, results] = await getCoinMarketDefault();
    let data = [];
    if (!err) { data = results }
    res.render('select-wallet', { data });
}

exports.googleAuth = async (req, res) => {
    const { code, scope } = req.query;
    const [error, data] = await getGoogleTokens(code);
    if (error) { res.redirect('/dashboard') }

    if (scope.includes("drive.appdata")) {
        req.session.user_session.driveAccess = data.access_token
        console.log(req.session.user_session)
        req.session.save(function (err) {
            res.redirect('/dashboard')
        })

    } else {
        if (error) { res.redirect('/login') }
        await storeUserInforFromGoogle(req, res, data);
    }

}

exports.coinbaseAuth = async (req, res) => {
    const { code } = req.query;
    const [error, data] = await getCoinBaseTokens(code);
    if (error) { res.redirect('/login') }
    await storeUserInforFromCoinbase(req, res, data);

}

exports.walletAPIConfirm = async (req, res) => {
    const { apiKey, secret, type } = req.body;
    let errMsg = null;

    if (type == "COINBASE") {
        const [error, results] = await getCoinbaseWalletFromAPI(apiKey, secret);
        if (error) { errMsg = encodeURIComponent("Coinbase API Key Invaid - Authentication Failed") }
    } else if (type == "BINANCE") {
        const [error, results] = await getBinanceWalletFromAPI(apiKey, secret);
        if (error) { errMsg = encodeURIComponent("Binance API Key Invaid - Authentication Failed") }
    } else {
        errMsg = encodeURIComponent("Authentication Faild")
    }

    if (errMsg) {
        res.redirect("/select-wallet?e=" + errMsg)
    } else {
        req.session.user_session.api_key = {
            apiKey, secret, type
        }
        req.session.save(function (err) {
            if (err) {
                res.redirect('/select-wallet')
            }
            res.redirect('/dashboard')
        })
    }

}


exports.logout = async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}



const defaultData = [{
    value: 0.00,
    symbol: 'BTC'
},
{
    value: 0.00,
    symbol: 'ETH'
},
{
    value: 0.00,
    symbol: 'XRP'
},
{
    value: 0.00,
    symbol: 'BNB'
}]

