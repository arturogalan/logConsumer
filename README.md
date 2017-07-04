# logConsumer

Log consumer written in node:

-Set in env/local.js:
    in winston:
        -The level of log trace, if set to debug everything will be traced.
        -The name of the log file to write the logs to.
    in kafka:
        -The connection string to Kafka instance.
        -The attemps to insert values.
        -The name of the TOPIC to store logs lines.
    in postgres:
        -the URL and the table where consumer will write the lines processed


Install docker image of postgres:
    -docker run -p 5432:5432 --name postgres-db -d postgres:latest
connect:
    -psql -h localhost -u postgres
execute:

For testing purposes in postgres execute first:

    CREATE USER loguser WITH PASSWORD 'loguser';
    alter role loguser WITH SUPERUSER;
    CREATE DATABASE logparser OWNER loguser;
    GRANT ALL PRIVILEGES ON DATABASE logparser TO loguser;


Install dependencies with:
    - npm i
Start app with:
    - node start

-Wait for consumer to start processing log events from kafka topic and send them to postgres
-The consumer process lines like that:
A logfile contains newline-terminated, space-separated text formatted like: <unix_timestamp> <hostname> <hostname>
Example:
1366815793 quark garak 
1366815795 brunt quark 
1366815811 lilac garak


Each line represents connection from a host (left) to another host (right) at a given time.



connect to database:
    psql logparser -h localhost -U postgres


NOTE: To log into the console change the transport class in modules/logger.js    