"use strict";

const mongoose = require('mongoose');

const dbqueue = require('../../../utils/db-queue');
const NotificationConsumer = require('./notification.consumer');

const LIB_CONSTS = require('../../../lib/constants');
const UTIL_CONST = require('../../../utils/constant');
const KAFKA_CONSTS = require('../../constants');
const notificationStatsModel = require('../../../lib/models/NotificationStats');
const libEnvConfig = LIB_CONSTS.config;

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(libEnvConfig.mongoUrl, {
    useNewUrlParser: true
}).then(() => {
  console.log(`Successfully connected to mongo database`);
    startKafkaConsumers();
}).catch(err => {
  console.error(`Could not connect to the database. Exiting now...`, err);
  process.exit();
});

let PushActionStatsQueue = new dbqueue.DbQueue(notificationStatsModel, UTIL_CONST.OP_QUEUE_TYPE.UPSERT, 2000, 1000);

let context = {
  'libEnvConfig': libEnvConfig,
  'notificationEnvConfig': KAFKA_CONSTS,
  'PushActionStatsQueue': PushActionStatsQueue
};

let startKafkaConsumers = function () {
  console.log("Notification consumers started..");
  NotificationConsumer.startNotificationConsumer(context);
};