const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error0) {
      throw error0;
    }

    const exchange = 'logs';
    const msg = process.argv.slice(2).join(' ') || 'Hello World!';

    channel.assertExchange(exchange, 'fanout', {
      durable: false,
    });

    // const opts = { headers: { 'asds': 'request', 'efg': 'test' }};
    channel.publish(exchange, '', Buffer.from(msg));
    console.log(' [x] Send %s', msg);
  })

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});