
const config = require('../../config/env/');
const app = require('../../lib/app');
const loginDao = require('../../lib/dao/loginDao');
const _ = require('lodash');



module.exports = function () {
    //Check table exist and create
    loginDao.checkAndCreateTable(config.postgres).catch(err => {
        app.logger.log('error', 'Error check and create table: ' + err);
    });

    //Each line readed, if it is of type dateAndHostLog, insert into DB
    function process(loginDao, message) {
        switch (typeOfMessage(message.value)) {
            case 'dateAndHostLog':
                loginDao.insertLogLine(message.value)
                .then(() => app.logger.log('debug', 'Line inserted into DB'))
                .catch(err => app.logger.log('error','Error inserting line into DB: ' + err));
                break;
            default:
                app.logger.debug('Unknow Event Received, ignoring: ', message.value);
                break;
        }
    }

    return {
        process: _.partial(process, loginDao)
    };
};


function typeOfMessage(message) {
    let fieldsInLine = message.split(/\s+/g);
    //Here we can check message format with regexp or others methods, for now we check that the message contains 3 fields
    //And the first field is a number -> timestamp unix
    if (message && fieldsInLine.length === 3 && !isNaN(fieldsInLine[0])) {
        return 'dateAndHostLog';
    } else {
        return 'unknownLogType';
    }
}

