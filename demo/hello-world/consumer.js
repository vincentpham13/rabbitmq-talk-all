const amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = 'hello';
    channel.assertQueue(queue, {
      durable: true,
    });

    // channel.nackAll();

    channel.consume(queue, function (msg) {
      console.log(" [x] Received %s", msg.content.toString());
      // channel.ack(msg);
    }, {
      noAck: true
    });
  });
});