var amqp = require('amqplib/callback_api');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
let totalProcessed = 0;

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = 'task_queue';

    channel.assertQueue(queue, {
      durable: true
    });

    // channel.prefetch(1);
    channel.consume(queue, async function (msg) {
      var secs = getRandomInt(3) * 1000;

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('processed message:', msg.content.toString());
          channel.ack(msg);
          totalProcessed++;
          resolve();
        }, secs);
      })
      // sumTime += (end - begin) / 1000;
    });
    setTimeout(() => {
      console.log('processed', totalProcessed);
    }, 20 * 1000);
  });
});

process.on('SIGINT', () => {
  console.log('total processed messages:', totalProcessed)
  process.exit(0)
})