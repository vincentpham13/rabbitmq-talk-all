const amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const incomingMsgs = [
      {
        id: 'q1', // unique identifier
        from: 'A',
        to: 'B',
        text: 'You invite Jason for a call',
        isFirstMsg: true,
        isSystemMsg: true
      },
      {
        id: 'q1',
        from: 'A',
        to: 'B',
        text: 'Hi B',
        isFirstMsg: false,
        isSystemMsg: false
      },
      {
        id: 'q2',
        from: 'A',
        to: 'C',
        text: 'Hi C',
        isFirstMsg: true,
        isSystemMsg: false
      },
      {
        id: 'q1',
        from: 'B',
        to: 'A',
        text: 'Hello there',
        isFirstMsg: false,
        isSystemMsg: false
      },
    ];
    const masterQueue = 'master_queue';

    for (const msg of incomingMsgs) {
      if (msg.isFirstMsg) {
        channel.assertQueue(masterQueue, {
          durable: true,
        });

        channel.sendToQueue(masterQueue, Buffer.from(msg.id));
      }

      channel.assertQueue(msg.id, {
        durable: true,
      }, function (error2, q) {
        if (error2) {
          throw error2;
        }
        channel.sendToQueue(q.queue, Buffer.from(JSON.stringify(msg)));
      })
    }

    setTimeout(() => {
      connection.close();
      process.exit(0)
    }, 1000);
  });
});