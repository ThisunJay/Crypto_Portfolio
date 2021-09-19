const { getGoogleAuthURL, getGoogleTokens, UploadFile } = require('../config/google-oauth');
const { getCoinBaseAuthURL, getCoinBaseTokens, getCoinMarketDefault } = require('../config/coinbase-oauth');
const { storeUserInforFromCoinbase, storeUserInforFromGoogle } = require('../config/util');

exports.defaultRoute = async (req, res) => {
    const [err, results] = await getCoinMarketDefault(5);
    let data = [];
    if (!err) { data = results }
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
    const [err, results] = await getCoinMarketDefault();
    let data = [];
    if (!err) { data = results }
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

exports.coinbaseWallet = async (req, res) => {
    const [walletError, walletDetails] = await getCoinbaseWallet(req);
}

// exports.uploadTest = async (req, res) => {
//     UploadFile().then(data => {
//         res.send(data);
//     }).catch(err => {
//         res.send(err);
//     })
// }

exports.logout = async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
}


