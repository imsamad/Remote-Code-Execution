import { rbmq_client } from '../rabbitMQ';

export const publishToQueue = async (queue_name: string, data: object) => {
  try {
    if (!rbmq_client.client) throw Error('Does not exits');

    const channel = await rbmq_client.client.createChannel();
    const result = await channel.assertQueue(queue_name);
    channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    throw new Error('cnsdjkn');
  }
};
