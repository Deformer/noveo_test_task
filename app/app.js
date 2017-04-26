/**
 * Created by sergey on 02.03.2017.
 */

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const checkCartLifeTime = require('./middlewares/checkCartLifeTime');
const pageNotFound = require('./middlewares/pageNotFound');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'jnfgiueg',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    //maxAge: 5 * 60 * 1000,
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

const port = process.env.PORT || 3000;

app.use(checkCartLifeTime);
app.use('/api', routes);
app.use(pageNotFound);

app.listen(port, () => {
  console.log(`Server is working ${port} port`);
});

module.exports = app;
