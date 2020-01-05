"use strict";

const Async = require('async');
const KafkaUtils = require('../../../utils/rd.kafka.util');
const NotificationConsumerService = require('./notification.consumer.service');

const NotificationConsumer = module.exports;

NotificationConsumer.startNotificationConsumer = function (context) {
  let notificationMessageProcessor = function (context, payload, callback) {
    console.log(`Processing  Notification stats API: ${payload.notificationId}`);
    NotificationConsumerService.processNotificationStatsPayload(payload, context,callback);
  };

  let cGSConfigs = {
    'consumerConfig': {
      'bootstrap.servers': context.libEnvConfig.kafkaBroker,
      'group.id': context.notificationEnvConfig.KAFKA_GROUP.PushStatsGroup,
    },
    'streamConfig': {
      'fetchSize': 1,
      'topics': context.notificationEnvConfig.KAFKA_TOPICS.PushStatsTopic,
      'highWaterMark':1
    }
  };

  _startConsumer(context, notificationMessageProcessor, cGSConfigs);
};

let _startConsumer = function (context, messageProcessor, cGSConfigs) {
  let queueWorker = function (payload, asyncCallback) {
    messageProcessor(context, payload, asyncCallback);
  };

  let queue = Async.queue(queueWorker, context.notificationEnvConfig.queueAsyncProcess);

  let consumerGroupStream = KafkaUtils.getConsumerGroupStream(cGSConfigs.streamConfig, cGSConfigs.consumerConfig);
  consumerGroupStream.on('data', function (message) {
    try {
      queue.push(JSON.parse(message.value));
    } catch (err) {
      console.error('Caught an error while parsing message: ', JSON.stringify(message));
    }
  });

  queue.saturated = function () {
    if (!consumerGroupStream.isPaused()) {
      consumerGroupStream.pause();
    }
  };

  queue.unsaturated = function () {
    if (consumerGroupStream.isPaused()) {
      consumerGroupStream.resume();
    }
  };

  console.log('Started Notification [' + cGSConfigs.streamConfig.topics + '] consumer !!');
};