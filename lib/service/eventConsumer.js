
const config = require('../../config/env/');
const Promise = require('bluebird');
const Kafka = require('no-kafka');
const util = require('util');
const app = require('../../lib/app');

//Consume kafka events and emit message as an event
var EventConsumer = function () {
    var consumer = new Kafka.GroupConsumer(config.kafka);
    consumer.init({
        subscriptions: [config.kafka.topic],
        handler: (messageSet, topic, partition) => {
            return Promise.each(messageSet, (m) => {
                if (m.message && m.message.value) {
                    let event = JSON.parse(m.message.value);
                    m.message.value = event;
                    this.emit('message', m.message);
                }
                // commit offset 
                return consumer.commitOffset({ topic: topic, partition: partition, offset: m.offset, metadata: 'optional' });
            });
        }
    });

    this.close = function () {
        consumer.close();
    };
};

util.inherits(EventConsumer, require('events').EventEmitter);
module.exports = EventConsumer;