const { getGoogleAuthURL, getGoogleTokens, UploadFile } = require('../config/google-oauth');
const { getCoinBaseAuthURL, getCoinBaseTokens } = require('../config/coinbase-oauth');

exports.defaultRoute = async (req, res) => {
    res.send('dashboard');
}

exports.login = async (req, res) => {
    const urls = {
        google: getGoogleAuthURL(),
        coinbase: getCoinBaseAuthURL(),
      }
      res.send({ urls });
}

exports.googleAuth = async (req, res) => {
    const { code } = req.query;
    const [error, data] = await getGoogleTokens(code);
    let is_error = false
    let method_data = { ...data }
    method_data.method = "google"
    req = storeTokens(req, method_data)
    const [userError, userData] = await storeUserInforFromGoogle(req);
    res.redirect('/')
}

exports.coinbaseAuth = async (req, res) => {
    const { code } = req.query;
    const [error, data] = await getCoinBaseTokens(code);
    let method_data = { ...data }
    method_data.method = "coinbase"
    req = storeTokens(req, method_data)
  
    const [userError, userData] = await storeUserInforFromCoinbase(req);
    console.log("TOKEN: ", req.session);
  
    res.redirect('/')
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


