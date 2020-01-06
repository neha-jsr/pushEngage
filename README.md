# pushEngage

created RESTful API for keeping track of click and view event of web push notification and retreving the total number of
click and view event by notificationId or siteId. 
 
Followings are the list of APIs:

1) tracking the click and view event from multiple sources

"Method": "POST"  
"Url":  "http://localhost:3009/trackPushStats/byActionType"
"Header":   "Content-Type": "application/json"
"body":  {
	 "siteId": "xxxxx",
      "notificationId": "12345678",
      "actionType": "view"
}

flow:  recieve the request --> validate the req body --> create job in kafka---> consumer consumer job --> perform bulk upsert operation


2)Get the Total views/click of a notification

"Method": "GET"  
"Url": http://localhost:3009/getPushStats/byNotification
"Header":   "Content-Type": "application/json"
"body": {
	 "siteId": "xxxxx",
      "notificationId": "12345678",
      "actionType": "view"
}

flow:  recieve the request --> validate the req body --> find query from mongo ---> send response

3) Get the Total views/click of a site eith dateRange

"Method": "GET"  
"Url":http://localhost:3009/getPushStats/bySiteId
"Header":   "Content-Type": "application/json"
"body": {
	 "siteId": "xxxxx",
     "actionType": "view",
     "startDate": "Sunday, 5 January 2020 15:30:00 GMT+05:30",
     "endDate": "Sunday, 5 January 2020 17:30:00 GMT+05:30"
}

flow:  recieve the request --> validate the req body --> find query from mongo ---> send response

Note:  For validation purpose used redis so when ever a new site or notification is created we need to update our redis cache
/*
when new site added we need to update cache by this key
*/
key = `sid:${siteId}`; value = 1;

/*
when new notification of paticular site is created we need to update cache by this key
*/
key = `snid:${siteId}:${notificationId}`;  value =1;



producer is running as main app: server.js
consumer is runnig in kafka: kafka/consumers/notification   app.js