const redis = require('redis');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const LIB_CONST = require('./lib/constants');
const pushStatsRouter = require('./routes/pushStats.routes');

const LIB_CONFIG = LIB_CONST.config;
const app = express();

// connecting to Redis
const redisCache = redis.createClient(LIB_CONFIG.redisPort, LIB_CONFIG.redisHost);

redisCache.on('error', (error) => {
    console.error(`Redis connection error ${error}`);
});

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(LIB_CONFIG.mongoUrl, {
    useNewUrlParser: true
}).then(() => {
    console.log(`Successfully connected to mongo database`);
    // listen for requests
    app.listen(LIB_CONFIG.pushPort, () => {
        console.log(`Server started listening on port ${LIB_CONFIG.pushPort}`);
    });

}).catch(err => {
    console.error(`Could not connect to the database. Exiting now...`, err);
    process.exit();
});

// add redis cache in req to validate the req in their repective routes
let middleWare = function (req, res, next) {
    if (req && req.body) {
        req.body.cache = redisCache;
        next();
    } else {
        return res.status(400).end('req body missing !!!');
    }
};

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(middleWare);

// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to pushEngage application" });
});

app.use('/trackPushStats', pushStatsRouter);

app.use('/getPushStats', pushStatsRouter);

// handle 404 error(Not found Error)
app.use(function (req, res, next) {
    let err = new Error('Path Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    console.error(err);

    if (err.status === 404)
        res.status(404).json({ message: "Path Not found" });
    else
        res.status(500).json({ message: "Something looks wrong :( !!!" });
});

module.exports = app;