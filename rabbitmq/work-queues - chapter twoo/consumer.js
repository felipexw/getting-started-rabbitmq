#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };

amqp.connect('amqp://localhost', opt, function (error, connection) {
    connection.createChannel(function (error, channel) {
        var queue = 'task_queue';

        channel.assertQueue(queue, {
            durable: true
        });

        const params = process.argv.slice(2).join(' ') || "Hello World!";
        const consumerName = params.split(" ")[0]
        //"só consome a próxima mensagem se já estiver finalizado de procesar a atual"
        channel.prefetch(1)
        console.log(`[${consumerName}:] Waiting for messages in %s. To exit press CTRL+C`, queue);
        channel.consume(queue, function (msg) {
            const secs = params.split(" ")[1];

            console.log(" [x] Received %s", msg.content.toString());
            const time = secs * 1000;
            setTimeout(function () {
                console.log(`${msg.content.toString()} [x] Done in ${time}`);
                channel.ack(msg);
            }, time);
        }, {
            noAck: false
        });
    });
});
