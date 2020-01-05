/*
Base Model to keep common code across all models
 */

let kafka = require('kafka-node');
let LIB_CONST = require('../../lib/constants');
let KAFKA_CONST = require('../constants');

let producer = null;

let BaseModel = function () { };

BaseModel.prototype.produceJob = function (topic, kafkaPayload) {
  return new Promise((resolve, reject) => {
    module.exports.setKafkaConnection().then(producer => {
      producer.send([
        { topic: topic, messages: JSON.stringify(kafkaPayload) }
      ], function (error, data) {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    }).catch(exception => {
      return reject(exception);
    })
  })
};

BaseModel.prototype.setKafkaConnection = function () {
  return new Promise((resolve, reject) => {
    if (producer) {
      return resolve(producer);
    } else {
      let HighLevelProducer = kafka.HighLevelProducer;
      let client = new kafka.Client(LIB_CONST.config.zookeeperServer, KAFKA_CONST.CLIENT_ID, {}, KAFKA_CONST.NO_ACK_BATCH_PRODUCER_OPTIONS);
      producer = new HighLevelProducer(client, { requireAcks: 0 });

      producer.on('error', function (error) {
        console.log(`Error in kafka connection`, error);
        return reject(error);
      });
      producer.on('ready', function () {
        return resolve(producer);
      });
    }
  })
};

module.exports = new BaseModel();