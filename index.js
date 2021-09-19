const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { getGoogleAuthURL, getGoogleTokens } = require('./src/config/google-oauth');
const { getCoinBaseAuthURL, getCoinBaseTokens, getCoinbaseWallet } = require('./src/config/coinbase-oauth');
const { storeTokens, storeUserInforFromGoogle, storeUserInforFromCoinbase } = require('./src/config/util')
dotenv.config();
const app = express();

app.use(session({
  secret: 'gkfjssLdew353593fd',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000, secure: true }
}));

app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));
app.use(express.static(__dirname + '/public'));
//import route
const importedRoutes = require('./src/routes/routes');
app.use(importedRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Server started and running on port ${process.env.PORT || 3000}`);
});

