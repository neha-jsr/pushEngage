const express = require('express');
const router = express.Router();

const validator = require('../utils/validator');
const TimeUtils = require('../utils/time.util');
const pushStatsController = require('../controller/pushStats.controller');

router.post('/byActionType', validator.validateNotificationPushStats, (req, res) => {
    let kafkaPayload = {
        'siteId': req.body.siteId,
        'notificationId': req.body.notificationId,
        'actionType': req.body.actionType,
        'epochHour': TimeUtils.getNowEpochHour()
    }
    pushStatsController.trackPushStatus(kafkaPayload).then((response) => {
        res.status(response.status).end();
    }).catch((rejection) => {
        res.status(rejection.status).end(rejection.reason);
    })
});


router.get('/byNotification', validator.validateNotificationPushStats, (req, res) => {
    let queryPayload = {
        'siteId': req.body.siteId,
        'actionType': req.body.actionType,
        'notificationId': req.body.notificationId
    }
    pushStatsController.getNotificationActionStats(queryPayload).then((data) => {
        res.status(data.status).send({'message': "SUCCESS", 'result':data.result});
    }).catch((rejection) => {
        res.status(rejection.status).end(rejection.reason);
    })
});


router.get('/bySiteId', validator.validateSiteActionStats, (req, res) => {
    let startHour = TimeUtils.getEpochHourFromTimestamp(req.body.startDate);
    let endHour = TimeUtils.getEpochHourFromTimestamp(req.body.endDate);
    let queryPayload = {
        'siteId': req.body.siteId,
        'actionType': req.body.actionType,
        'startHour': startHour,
        'endHour': endHour
    }
    pushStatsController.getSiteActionStats(queryPayload).then((data) => {
        res.status(data.status).send({'message': "SUCCESS", 'result':data.result});
    }).catch((rejection) => {
        res.status(rejection.status).end(rejection.reason);
    })
});

module.exports = router;