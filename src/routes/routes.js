const express = require("express");
const router = express.Router();

//import controller
const importedController = require('../controllers/controller');

router.get('/dashboard', importedController.defaultRoute);

router.get('/login', importedController.login);

router.get('/auth/google', importedController.googleAuth);

router.get('/auth/coinbase', importedController.coinbaseAuth);

router.get('/select-wallet', importedController.selectWallet)

router.post('/confirm-wallet', importedController.walletAPIConfirm)

router.get('/test', importedController.test)

router.get('/logout', importedController.logout)

module.exports = router;
