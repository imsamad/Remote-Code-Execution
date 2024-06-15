require('dotenv').config();

import { rbmq_client } from './rabbitMQ';
import { serverInstance as app } from './server';

const PORT = process.env.PORT || 4000;

rbmq_client.connect(process.env.RABBITMQ_URL!).then(() => {
  console.log('Connected to RabbitMQ!');
  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
});
