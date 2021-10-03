const express = require("express");
const router = express.Router();

//import controller
const importedController = require('../controllers/controller');
const { authCheck, authNotCheck } = require('../middleware/auth.middleware')

router.get('/login', authNotCheck, importedController.login);

router.get('/', (req, res) => res.redirect('/dashboard'))

router.get('/dashboard', authCheck, importedController.defaultRoute);

router.get('/auth/google', importedController.googleAuth);

router.get('/auth/coinbase', importedController.coinbaseAuth);

router.get('/select-wallet', authCheck, importedController.selectWallet)

router.post('/confirm-wallet', authCheck, importedController.walletAPIConfirm)

router.get('/test', importedController.test)

router.get('/logout', importedController.logout)

module.exports = router;
