const express = require("express");
const router = express.Router();

//import controller
const importedController = require('../controllers/controller');

router.get('/', importedController.defaultRoute);

router.get('/login', importedController.login);

router.get('/auth/google', importedController.googleAuth);

router.get('/auth/coinbase', importedController.coinbaseAuth);

router.get('/coinbase-wallet', importedController.coinbaseWallet)

router.get('/select-wallet', importedController.selectWallet)

// router.get('/test', importedController.uploadTest)

router.get('/logout', importedController.logout)

module.exports = router;
