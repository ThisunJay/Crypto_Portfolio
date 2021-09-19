const express = require("express");
const router = express.Router();

//import controller
const importedController = require('../controllers/controller');

router.get('/', importedController.defaultRouteFunction);

router.get('/login', importedController.loginFunction);

router.get('/auth/google', importedController.googleAuthFunction);

router.get('/auth/coinbase', importedController.coinbaseAuthFunction);

router.get('/test', importedController.uploadTest)

module.exports = router;