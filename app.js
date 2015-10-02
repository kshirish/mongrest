let express = require('express');
let logger = require('morgan');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let routes = require('./routes/index');
let auth = require('./routes/authentication');
const configDb = require('./config/database.js');

const port = 3000;
const restBaseUrl = '/' + (configDb.urlPrefix || '');
let app = express();

// middlewares
app.use(logger('dev'));
app.use(session({ secret: 'nowyouseeme' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
//app.use('/auth', auth);
app.use(restBaseUrl, routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ data: 'Some error occurred.', error: true });
});

// listenting to port
app.listen(port);
console.log('listenting to port: ' + port);
