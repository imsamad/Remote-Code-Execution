import amqp, { Options } from 'amqplib';
let retryCount = 0;

class RBMQClient {
  private _client?: amqp.Connection;
  get client() {
    if (!this._client)
      throw new Error('Cannot access RabbitMQ before connecting!');
    return this._client;
  }

  async connect(url: string | Options.Connect) {
    try {
      if (this._client) return this._client;

      this._client = await amqp.connect(url);
      return this._client;
    } catch (err) {
      console.log('error from RBMQ connect: ', err);
      // if (retryCount < 10) {
      //   retryCount++;
      //   setTimeout(() => {
      //     console.log('retried: ', retryCount);
      //     this.connect(url);
      //   }, 2000);
      // } else
      throw err;
    }
  }
}

export const rbmq_client = new RBMQClient();
