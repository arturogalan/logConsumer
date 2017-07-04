'use strict';

module.exports = {
    environment: process.env.NODE_ENV || "local",
    winston: {
        level: "debug",
        fileName: "logconsumer.log"
    },
    kafka: {
        connectionString: process.env.KAFKA_URL || 'localhost:9092',
        retries: {
            attempts: process.env.KAFKA_ATTEMPTS || 3
        },
        topic: process.env.KAFKA_TOPIC || 'templogfiles'
    },
    postgres: {
        url: 'postgres://loguser:loguser@localhost:5432/logparser',
        tableName: process.env.LOGIN_DATABASE_TABLE_NAME || 'hostconnections'
    }
    
};
