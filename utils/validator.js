const UTIL_CONST = require('./constant');
const TimeUtil = require('./time.util');

exports.validateNotificationPushStats = function (req, res, next) {
    let redisCache = req.body.cache;
    if (req.body.siteId && req.body.notificationId && req.body.actionType) {
        // check site and notification Id present in cache or not
        let key = `snid:${req.body.siteId}:${req.body.notificationId}`;
        redisCache.exists(key, function (error, reply) {
            if (error || reply == 0) {
                return res.status(400).end('Invalid req argument missing!!!');
            }
            next();
        })
    } else {
        res.status(400).end('Invalid req argument missing!!!');
    }
}

exports.validateSiteActionStats = function (req, res, next) {
    let redisCache = req.body.cache;
    if (!req.body.siteId) {
        res.status(400).end('Invalid req siteId missing!!!');
    } else if (req.body.actionType != UTIL_CONST.ACTION_TYPE.CLICK && req.body.actionType != UTIL_CONST.ACTION_TYPE.VIEW) {
        res.status(400).end('Invalid action type in request!!!');
    } else if (!TimeUtil.validateDateRange(req.body.startDate, req.body.endDate)) {
        res.status(400).end('Invalid req date range!!!');
    } else {
        // check siteId is present or not
        let key = `sid:${req.body.siteId}`;
        redisCache.exists(key, function (error, reply) {
            if (error || reply == 0) {
                return res.status(400).end('Invalid siteId!!!');
            }
            next();
        })
    }
}