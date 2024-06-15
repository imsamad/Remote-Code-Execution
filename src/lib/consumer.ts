import { ConsumeMessage } from 'amqplib';
import { rbmq_client } from '../rabbitMQ';

export const consumer = async (
  queue_name: string,
  cb: (msg: ConsumeMessage | null) => void
) => {
  try {
    if (!rbmq_client.client) throw Error('Does not exits');

    const channel = await rbmq_client.client.createChannel();
    const result = await channel.assertQueue(queue_name);
    //  const msg = await channel.consume(queue_name);
    // return new Promise((resolve, reject) => {
    channel.consume(queue_name, (message) => {
      cb(message);
    });
    // });
  } catch (error) {
    console.log('error:er', error);
  }
};
