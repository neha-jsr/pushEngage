'use strict';

const NotificationConsumerService = module.exports

NotificationConsumerService.processNotificationStatsPayload = function (payload, context, callback) {
  let key = {
    siteId: payload.siteId,
    notificationId: payload.notificationId,
    actionType: payload.actionType,
    epochHour: payload.epochHour
  };
  let EventStatsQueue = context.PushActionStatsQueue;
  let updateCommand = { "$inc": { 'count': 1 } };

  let operation = { query: key, update: updateCommand };
  EventStatsQueue.add(JSON.parse(JSON.stringify(operation)), function () {
    callback();
  });
}
