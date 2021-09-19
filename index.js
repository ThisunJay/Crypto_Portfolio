const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

app.use(session({
  secret: 'gkfjssLdew353593fd',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));

app.use(cookieParser('secret'));
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

const session_obj = {
  user_info: null,
  access_token: "",
  refresh_token: "",
  scope: "",
  is_athenticate: true,
  method: ["google", "coinbase"]
}