const Pool = require('pg').Pool;
const url = require('url');
const config = require('../../config/env/').postgres;
const conn = setPGConnection(config);
const pool = new Pool(conn);
const app = require('../../lib/app');


module.exports = {
    checkAndCreateTable: checkAndCreateTable,
    insertLogLine: insertLogLine,
};

pool.on('error', (error, client) => {
    app.logger.log('error', 'error in postgres pool: ' + error);
});

//Parse URL into config PG
function setPGConnection(options) {
    const params = url.parse(options.url);
    const auth = params.auth.split(':');
    const dbase = params.pathname.split('/')[1];

    if(!params || !auth || !dbase){
        app.logger.log('error', 'error in postgres URL: ' + options.url);
        throw Error("Error in postgres URL");
    }

    const config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: dbase,
    };


    return config;
}

//Check and create table if doen's exist
function checkAndCreateTable(config) {
    return new Promise((fullfil, reject) => {
        pool.query('CREATE TABLE IF NOT EXISTS ' + config.tableName +
            ' ("conndate" timestamp with time zone, "starthost" VARCHAR(255) NOT NULL, ' +
            '"endhost" VARCHAR(255) NOT NULL , PRIMARY KEY ("conndate","starthost","endhost") );'+
            ' SET timezone = "UTC";',
            function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    fullfil();
                }
            });

    });
}


//Insert log line separated into 3 fields: timestamp, startHost and endHost
function insertLogLine(message) {
    return new Promise((fullfil, reject) => {
        let fieldsInLine = message.split(/\s+/g);
        let logtimestamp = new Date(Date.parse(fieldsInLine[0] + "+0000"))
        var temp = new Date(fieldsInLine[0]);

        // values (TO_TIMESTAMP($1::double precision / 1000)
        pool.query('insert into ' + config.tableName + ' (conndate,startHost,endHost)  values (TO_TIMESTAMP($1::double precision / 1000),$2,$3);', [fieldsInLine[0]*1000,fieldsInLine[1],fieldsInLine[2]],
            function (err, result) {
                if (err) {
                        reject(err);
                } else {
                    fullfil();
                }
            });

    });
}
