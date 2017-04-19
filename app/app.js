/**
 * Created by sergey on 02.03.2017.
 */

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const checkCartLifeTime = require('./middlewares/checkCartLifeTime');
const pageNotFound = require('./middlewares/pageNotFound');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const session = require('express-session')({
  secret: 'jnfgiueg',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
});

const port = process.env.PORT || 3000;


app.use(session);
app.use(checkCartLifeTime);
app.use('/api', routes);
app.use(pageNotFound);

app.listen(port, () => {
  console.log(`Server is working ${port} port`);
});
