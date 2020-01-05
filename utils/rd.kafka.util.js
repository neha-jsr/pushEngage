"use strict";

const __ = require('lodash');
const RDKafka = require('node-rdkafka');

const defaultConsumerConfig = {
  // Automatically and periodically commit offsets in the background.
  'enable.auto.commit': true,

  // The frequency in milliseconds that the consumer offsets are commited (written) to offset storage. (0 = disable)
  'auto.commit.interval.ms': 2500,

  // Name of partition assignment strategy to use when elected group leader assigns partitions to group members.
  'partition.assignment.strategy': 'roundrobin',

  // Maximum transmit message size.
  'message.max.bytes': 10485760, // 10 MB

  // Maximum receive message size. This is a safety precaution to avoid memory exhaustion in case of protocol hickups.
  // The value should be at least fetch.message.max.bytes * number of partitions consumed from + messaging overhead (e.g. 200000 bytes).
  'receive.message.max.bytes': 106857600,

  // Timeout for network requests.
  'socket.timeout.ms': 60000,

  // Disconnect from broker when this number of send failures (e.g., timed out requests) is reached.
  // Disable with 0. NOTE: The connection is automatically re-established.
  'socket.max.fails': 5,

  // Client group session and failure detection timeout.
  'session.timeout.ms': 30000,

  // Group session keepalive heartbeat interval.
  'heartbeat.interval.ms': 1000,

  // How often to query for the current client group coordinator. If the currently assigned coordinator
  // is down the configured query interval will be divided by ten to more quickly recover in case of coordinator reassignment.
  'coordinator.query.interval.ms': 60000,

  // Maximum time the broker may wait to fill the response with fetch.min.bytes.
  'fetch.wait.max.ms': 100,

  // Minimum number of bytes the broker responds with. If fetch.wait.max.ms expires
  // the accumulated data will be sent to the client regardless of this setting.
  'fetch.min.bytes': 1,

  // Maximum number of bytes per topic + partition to request when fetching messages from the broker.
  'fetch.message.max.bytes': 1048576 // 1 MB
};

const defaultTopicConfig = {
  // Action to take when there is no initial offset in offset store or the desired offset is out of range: 
  // 'smallest','earliest' - automatically reset the offset to the smallest offset,
  // 'largest','latest' - automatically reset the offset to the largest offset,
  // 'error' - trigger an error which is retrieved by consuming messages and checking 'message->err'.
  'auto.offset.reset': 'largest',

  // Offset commit store method: 'file' - local file store (offset.store.path, et.al),
  // 'broker' - broker commit store (requires Apache Kafka 0.8.2 or later on the broker).
  'offset.store.method': 'broker',

  // fsync() interval for the offset file, in milliseconds. Use -1 to disable syncing, and 0 for immediate sync after each write.
  'offset.store.sync.interval.ms': 5000
};

const defaultStreamConfig = {
  'fetchSize': 500,
  'objectMode': true,
  'waitInterval': 1000,
};

const rdKafkaClient = module.exports;

// Make sure that you have following properties available in the following objects
// streamConfig
// - 'topics' - String | Array (containg topic/s)
// consumerConfig
// - 'bootstrap.servers' - Initial list of brokers.
// - 'group.id' - Client group id string. All clients sharing the same group.id belong to the same group.
rdKafkaClient.getConsumerGroupStream = function (streamConfig, consumerConfig, topicConfig = {}) {
  // populating configs with default values
  __.defaults(consumerConfig, defaultConsumerConfig);
  __.defaults(topicConfig, defaultTopicConfig);
  __.defaults(streamConfig, defaultStreamConfig);

  return new RDKafka.KafkaConsumer.createReadStream(consumerConfig, topicConfig, streamConfig);
};
