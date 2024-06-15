import amqp, { Options } from 'amqplib';

class RBMQClient {
  private _client?: amqp.Connection;
  get client() {
    if (!this._client)
      throw new Error('Cannot access RabbitMQ before connecting!');
    return this._client;
  }

  async connect(url: string | Options.Connect) {
    if (this._client) return this._client;

    this._client = await amqp.connect(url);
    return this._client;
  }
}

export const rbmq_client = new RBMQClient();
