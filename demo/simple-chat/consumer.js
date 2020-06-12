var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var masterQueue = 'master_queue';
    channel.assertQueue(masterQueue, {
      durable: true,
    });

    channel.consume(masterQueue, function (msg) {
      const queueName = msg.content.toString();
      channel.assertQueue(queueName, {
        durable: true,
      });

      console.log(" [x] created consumer for queue: %s", msg.content.toString());

      channel.consume(queueName, function (msg) {
        if (msg.content) {
          const message = JSON.parse(msg.content);
          if (message.isSystemMsg) {
            console.log(" [x] System: %s", message.text);
          } else {
            console.log(" [x] %s messaged %s: %s", message.from, message.to, message.text);
          }
          // Store new message
          channel.ack(msg);
        }
      });
    }, {
      noAck: true
    });
  });
});