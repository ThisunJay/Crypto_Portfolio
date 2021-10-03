const axios = require("axios");
const ccxt = require('ccxt')
const dayjs = require('dayjs')

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
                is_athenticate: true,
                driveAccess: null,
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
                driveAccess: null,
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
    let driveAccess = req.session?.user_session?.driveAccess;

    res.locals.values = {
        query: req.query,
        user_info: info ? info : null,
        driveAccess: driveAccess ? driveAccess : null
    }
    next();
}

async function generateDashboardData(dataset = []) {

    const exchange = new ccxt.binance({ 'enableRateLimit': true })
    const pairs = dataset.map(i => `${i.symbol}/USDT`)
    const currentPrices = await exchange.fetchTickers(pairs);
    let historicalData = [];
    let daysList = []

    for (let x = 0; x < dataset.length; x++) {
        const symbol = dataset[x].symbol;
        const value = dataset[x].value;
        if (value > 0) {
            let hd = await exchange.fetchOHLCV(`${symbol}/USDT`, '1d', undefined, 14)
            hd = hd.map(item => ({
                time: dayjs(item[0]).format('YYYY-MM-DD'),
                value: item[1],
                valueUSD: item[1] * value,
            }))
            if (x == 0) { daysList = hd.map(i => i.time) }
            historicalData.push({ symbol, hd })
        }
    }

    let finalHD = daysList.map(daytime => {
        let dayvalue = historicalData.reduce((acc, coin) => {
            let ob = coin.hd.find(hd => hd.time == daytime)
            return acc + ob.valueUSD;
        }, 0)
        return { daytime, dayvalue }
    })

    let historyLabels = finalHD.map(i => i.daytime)
    let historyValues = finalHD.map(i => i.dayvalue)

    let myAssets = dataset.map(coin => {
        return {
            ...coin,
            valueUSD: currentPrices[`${coin.symbol}/USDT`]?.last * coin.value
        }
    })
    let pieChartValues = myAssets.map(coin => coin.valueUSD)
    let total = pieChartValues.reduce((a, c) => a + c, 0)

    return {
        total,
        myAssets,
        pieChart: {
            labels: dataset.map(i => i.symbol),
            values: pieChartValues
        },
        historyChart: {
            labels: historyLabels,
            values: historyValues
        },
    };

}

module.exports = {
    storeUserInforFromGoogle,
    storeUserInforFromCoinbase,
    getCoinMarketDefault,
    setupLocalValues,
    generateDashboardData
}

