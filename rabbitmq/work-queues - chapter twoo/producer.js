const amqp = require('amqplib/callback_api');

const opt = { credentials: require('amqplib').credentials.plain('root', 'root') };

let i = 0
amqp.connect('amqp://localhost', opt, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    setInterval(() => {
      var queue = 'task_queue';
      var msg = (process.argv.slice(2).join(' ') || "Hello World!") + ' index: ' + i;
      i++
      channel.assertQueue(queue,
        {
          durable: true
        });
      channel.sendToQueue(queue, Buffer.from(msg),
        {
          persistent: true
        });
      console.log(" [x] Sent '%s'", msg);
    }, 500)
  });
});