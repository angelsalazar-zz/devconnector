require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

const db = require('./database');
const api = require('./routes/api');
const setPassportConfig = require('./services/passport.service');

setPassportConfig(passport);

const app = express();

app.use(morgan('dev'));

// init passport
app.use(passport.initialize());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use('/api/v1', api(express));

app.listen(process.env.PORT, (err) => {
    if (err) {
        return console.log('ERROR', err);
    }
    console.log(`Server up on port ${process.env.PORT}`);
})