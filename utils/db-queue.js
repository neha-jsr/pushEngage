'use strict';
/*jslint node: true */

let CONST = require('./constant');

let dbqueue = module.exports;

dbqueue.DbQueue = function (object, type, maxOps, maxTime) {
  this.object = object;
  this.type = type;
  this.maxOps = maxOps || 1;
  this.maxTime = maxTime || 1000;
  this.lastFlushTime = (new Date()).getTime();
  this.opCache = [];
  this.opsDictionary = {};
  this.isInitialized = false;
};

dbqueue.DbQueue.prototype = {
  constructor: dbqueue.DbQueue,

  shouldFlush: function () {
    let time = (new Date()).getTime();
    if ((Object.keys(this.opsDictionary).length > this.maxOps ||
      time - this.lastFlushTime > this.maxTime)) {
      return true;
    }
    return false;
  },

  flush: function (callback) {
    let bulk = this.object.collection.initializeUnorderedBulkOp();
    let N = this.opCache.length;
    if (N > 0) {
      for (let i = 0; i < N; i++) {
        let op = this.opCache[i];
        if (this.type == CONST.OP_QUEUE_TYPE.INSERT) {
          bulk.insert(op.query);
        } else {
          bulk.find(op.query).upsert().update(op.update);
        }
        //console.log(op);
      }
      this.opCache.splice(0, N);
      this.lastFlushTime = (new Date()).getTime();

      bulk.execute(function (err) {
        if (err) {
          console.log('Error updating stats: ' + err);
        }
      if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  },

  flushFromDict: function () {    
    let N = Object.keys(this.opsDictionary).length;
    let modelType = this.object.modelName;
    
    if (N > 0) {
      // console.log(this.opsDictionary);
      let bulk = this.object.collection.initializeUnorderedBulkOp();
      for (let key in this.opsDictionary) {
        if (this.type == CONST.OP_QUEUE_TYPE.INSERT) {
          bulk.insert(key);
        } else {
          bulk.find(JSON.parse(key)).upsert().update(this.opsDictionary[key]);
        }
      }

      this.opsDictionary = {};
      this.lastFlushTime = (new Date()).getTime();

      bulk.execute(function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  },

  scheduleFlush: function (callback) {
    let that = this;

    setInterval(function () {
      if (that.shouldFlush()) {
        that.flushFromDict();
      }
    }, this.maxTime);

    this.isInitialized = true;
    return callback && callback()
  },

  addToDict: function (op) {
    if (this.opsDictionary[JSON.stringify(op.query)]) {
      if (op.update['$inc']) {
        let updateParams = this.opsDictionary[JSON.stringify(op.query)];
        for (let key in op.update['$inc']) {
          if (updateParams.$inc[key]) {
            updateParams.$inc[key] += op.update['$inc'][key]
          } else {
            updateParams.$inc[key] = op.update['$inc'][key];
          }
        }
      }
    } else {
      this.opsDictionary[JSON.stringify(op.query)] = op.update;
    }
  },

  add: function (op, callback) {
    //this.opCache.push(op);
    this.addToDict(op);

    if (!this.isInitialized) {
      this.scheduleFlush(callback);
    }
    else {
      return callback && callback();
    }
  }
};
