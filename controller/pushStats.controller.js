const KafkaApi = require('../kafka/routes/api');
const KAFKA_CONST = require('../kafka/constants');
const NotificationStatsModel = require('../lib/models/NotificationStats');

exports.trackPushStatus = (kafkaPayload) => {
    return new Promise((resolve, reject) => {
        KafkaApi.kafkaJobProducer(KAFKA_CONST.KAFKA_TOPICS.PushStatsTopic, kafkaPayload).then(response => {
            console.log(`Successfully produced kafka job for Notification ${kafkaPayload.notificationId} action stats request`);
            return resolve({ 'status': 200, 'result': "success" });
        }).catch(error => {
            console.log(`SError producing Kafka job for Notification ${kafkaPayload.notificationId} action stats request`);
            return reject({ 'status': 500, 'reason': error });
        })
    })
}

exports.getNotificationActionStats = (payload) => {
    return new Promise((resolve, reject) => {
        NotificationStatsModel.aggregate([
            {
                $match: {
                    "notificationId": payload.notificationId,
                    "siteId": payload.siteId,
                    "actionType": payload.actionType
                }
            }, {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$count"
                    }
                }
            }
        ], function (error, result) {
            if (error) {
                return reject({ 'status': 500, 'reason': error });
            }
            return resolve({ 'status': 200, 'result': result[0].total });
        });
    })
}

exports.getSiteActionStats = (payload) => {
    return new Promise((resolve, reject) => {
        NotificationStatsModel.aggregate([
            {
                $match: {
                    "siteId": payload.siteId,
                    "actionType": payload.actionType,
                    "epochHour": { $gte: payload.startHour, $lte: payload.endHour }
                }
            }, {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$count"
                    }
                }
            }
        ], function (error, result) {
            if (error) {
                return reject({ 'status': 500, 'reason': error });
            }
            return resolve({ 'status': 200, 'result': result[0].total });
        });
    })
}