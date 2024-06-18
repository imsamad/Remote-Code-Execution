import * as redis from 'redis';
let retryCount = 0;
class Redis {
  private _client?: any; // Define the type of _client

  get client() {
    return this._client;
  }

  async connect(url: string) {
    try {
      if (this._client) return this._client;

      const client = redis.createClient({
        url,
      });

      this._client = await client.connect();
      return this._client;
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      // if (retryCount < 10) {
      //   retryCount++;
      //   setTimeout(() => {
      //     console.log('retried: ', retryCount);
      //     this.connect(url);
      //   }, 2000);
      // } else
      throw error; // Optionally handle or throw the error
    }
  }
}

const redisInstance = new Redis();

export { redisInstance };
