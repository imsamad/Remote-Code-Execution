require('dotenv').config();

import { rbmq_client } from './rabbitMQ';
import { redisInstance } from './redis';
import { serverInstance as app } from './server';

const PORT = process.env.PORT || 4000;

redisInstance
  .connect(process.env.REDIS_URL!)
  .then(() => {
    console.log('Redis Connected!');
    rbmq_client.connect(process.env.RABBITMQ_URL!).then(() => {
      console.log('RabbitMQ Connected!');
      app.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`);
      });
    });
  })
  .catch((err) => {
    console.log('err from server/index file: ', err);
  });
