const fslogger = require('../modules/logger')
const config = require('../config/env');
const app = module.exports;
const EventConsumer = require('../lib/service/eventConsumer');
const EventProcessor = require('../lib/service/eventProcessor');
var logger;


module.exports = {
    start: start,
};

function start() {
    configureLogger();
    var consumer = new EventConsumer();
    var processor = new EventProcessor();

    //Subscribe to events on message and on errors
    consumer.on('message', (message) => {        
        processor.process(message);
    });
    consumer.on('error', (err) => {
        logger.log('error' , 'error: ', err);
    });
    consumer.on('offsetOutOfRange', (err) => {
        logger.log('error' , 'error: offsetOutOfRange: ', err);
    });
};



function configureLogger() {
    logger = fslogger.configureLogger();
    app.logger = logger;
    logger.log('info', 'Initializing app consumer!');
}





