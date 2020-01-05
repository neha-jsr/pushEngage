let environments = {
    PROD: 'production',
    STAGING: 'staging',
    DEVELOPMENT: 'development'
};
exports.ENVIRONMENTS = environments;

let config = {
    // This mode will run only routes required for production
    prod: {
        environment: environments.PROD,
        pushPort: 3009,
        mongoUrl: 'mongodb://127.0.0.1/pushEngage',
        redisHost: '127.0.0.1',
        redisPort: '6379',
        kafkaBroker: '127.0.0.1:9092',
        zookeeperServer: '127.0.0.1:2181'
    },
    // This mode will run only routes required for staging
    staging: {
        environment: environments.STAGING,
        pushPort: 3009,
        mongoUrl: 'mongodb://127.0.0.1/pushEngage',
        redisHost: '127.0.0.1',
        redisPort: '6379',
        kafkaBroker: '127.0.0.1:9092',
        zookeeperServer: '127.0.0.1:2181'
    },

    // This mode will run only routes required for development
    development: {
        environment: environments.DEVELOPMENT,
        pushPort: 3009,
        mongoUrl: 'mongodb://127.0.0.1/pushEngage',
        redisHost: '127.0.0.1',
        redisPort: '6379',
        kafkaBroker: '127.0.0.1:9092',
        zookeeperServer: '127.0.0.1:2181'
    }
};

let currentConfig;
if (process.env.NODE_ENV == 'production') {
    currentConfig = config.prod;
} else if (process.env.NODE_ENV == 'staging') {
    currentConfig = config.staging;
} else {
    currentConfig = config.development;
}

exports.config = currentConfig;