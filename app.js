/**
 * Created by sergey on 02.03.2017.
 */

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    routes = require('./routes/index'),
    checkCartLifeTime = require('./middlewares/checkCartLifeTime'),
    pageNotFound = require('./middlewares/pageNotFound');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let session = require('express-session')({
    secret: 'jnfgiueg',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24*60*60*1000
    }
});

const port = process.env.PORT || 3000;


app.use(session);
app.use(checkCartLifeTime);
app.use('/api',routes);
app.use(pageNotFound);

app.listen(port,() => {
    console.log(`Server is working ${port} port`)
});