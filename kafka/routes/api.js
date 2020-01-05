const Producer = require('../producer/producer');

exports.kafkaJobProducer = (topic, payload) => {
    return new Promise((resolve, reject) => {
        Producer.produceJob(topic, payload).then(response => {
            return resolve();
        }).catch(error => {
            return reject(`error producing Job ${JSON.stringify(error)}`);
        })
    });
}