exports.CLIENT_ID = 'pushEngage-node';
exports.queueAsyncProcess = 2;

exports.NO_ACK_BATCH_PRODUCER_OPTIONS = {
    noAckBatchSize: 5000000, //5 MB
    noAckBatchAge: 5000 // 5 Sec
}

exports.KAFKA_TOPICS = {
    PushStatsTopic : 'push.NotificationStats'
}

exports.KAFKA_GROUP = {
    PushStatsGroup : 'push-NotificationStats'
};