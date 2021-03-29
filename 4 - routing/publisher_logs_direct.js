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
        const exchange = 'direct_logs';
        const args = process.argv.slice(2);
        const msg = args.slice(1).join(' ') || 'Hello World!';

        let index = 0

        setInterval(() => {
            const severity = (args.length > 0) ? args[0] : 'info';
            index = index === 0 ? 1 : 0;
            
            channel.assertExchange(exchange, 'direct', {
                durable: false
            });
            channel.publish(exchange, severity, Buffer.from(msg));
            console.log(" [x] Sent %s: '%s'", severity, msg);
        }, 750)
    });

    // setTimeout(function () {
    //     connection.close();
    //     process.exit(0);
    // }, 500);
});