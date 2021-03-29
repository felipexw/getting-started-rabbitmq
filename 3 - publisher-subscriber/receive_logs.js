const amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };

amqp.connect('amqp://localhost', opt, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        const exchange = 'logs';

        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        const time = process.argv[2] || 2

        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            channel.bindQueue(q.queue, exchange, '');
            channel.prefetch(1)
            channel.consume(q.queue, function (msg) {
                setTimeout(() => {
                    if (msg.content) {
                        console.log(" [x] %s", msg.content.toString());
                    }
                    channel.ack(msg)
                }, time)
            }, {
                noAck: false
            });
        });
    });
});