var amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };

amqp.connect('amqp://localhost', opt, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'logs';


        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });
        let i = 0
        setInterval(() => {
            const msg = process.argv.slice(2).join(' ') || 'Hello World!' + ' Index: ' + i;
            i++
            channel.publish(exchange, '', Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        }, 1250)
    });

    // setTimeout(function () {
    //     connection.close();
    //     process.exit(0);
    // }, 5000);
});