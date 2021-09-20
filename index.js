const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const { urlencoded } = require('body-parser');
const { setupLocalValues } = require('./src/config/util');
dotenv.config();
const app = express();

app.use(session({
  secret: 'gkfjssLdew353593fd',
  resave: false,
  genid: function (req) {
    return uuidv4() // use UUIDs for session IDs
  },
  saveUninitialized: false,
  cookie: { maxAge: 60000, secure: false }
}));

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));
app.use(express.static(__dirname + '/public'));

app.use(setupLocalValues);
//import route
const importedRoutes = require('./src/routes/routes');
app.use(importedRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Server started and running on port ${process.env.PORT || 3000}`);
});

