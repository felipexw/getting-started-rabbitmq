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
        const exchange = 'topic_logs';
        const args = process.argv.slice(2);
        const key = (args.length > 0) ? args[0] : 'anonymous.info';
        const msg = args.slice(1).join(' ') || 'Hello World!';

        setInterval(() => {
            channel.assertExchange(exchange, 'topic', {
                durable: false
            });
            channel.publish(exchange, key, Buffer.from(msg));
            console.log(" [x] Sent %s: '%s'", key, msg);
        }, 750)
    });
});