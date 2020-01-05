'use strict';

const TIME_CONSTS = require('./time.constants');

const TimeUtil = module.exports;

TimeUtil.getNowEpochHour = function () {
    return TimeUtil.getEpochHourFromMils(new Date().getTime());
};

TimeUtil.getEpochHourFromMils = function (timeInMillis) {
    return Math.round(timeInMillis / TIME_CONSTS.MILS_IN_HOUR);
};

// assuming timeInMillis will always be epoch in milliseconds
TimeUtil.getEpochHourFromTimestamp = function (timestamp) {
    return TimeUtil.getEpochHourFromMils(new Date(timestamp).getTime());
};

TimeUtil.validateDateRange = function(startDate, endDate){
    if (startDate && endDate && (new Date(startDate).getTime() < new Date(endDate).getTime())) {
        return true;
    }
    return false;
}