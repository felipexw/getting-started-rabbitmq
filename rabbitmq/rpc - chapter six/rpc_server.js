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
        const queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            const n = parseInt(msg.content.toString());

            console.log(" [.] fib(%d)", n);

            const r = fibonacci(n);

            setInterval(() => {
                channel.sendToQueue(msg.properties.replyTo,
                    Buffer.from(r.toString()), {
                    correlationId: msg.properties.correlationId
                });

                channel.ack(msg);
            }, 2200)
        });
    });
});

function fibonacci(n) {
    if (n === 0 || n === 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);
}