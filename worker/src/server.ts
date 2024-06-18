import fs from 'fs';

import { rbmqInstance } from './rabbitMQ';
import { redisInstance } from './reddis';
import { exec } from 'child_process';

const queue_name = 'jobs';
const extensions = {
  cpp: 'cpp',
  'c++': 'cpp',
  c: 'c',
  java: 'java',
  python3: 'py',
  python: 'py',
  py: 'py',
};

redisInstance
  .connect(process.env.REDIS_URL!)
  .then(async (redisClient) => {
    console.log('Redis connected!');

    rbmqInstance.connect(process.env.RABBITMQ_URL!).then(async (client) => {
      if (!client) {
        return;
      }
      console.log('RabbitMQ connected!');

      const channel = await client.createChannel();
      await channel.assertQueue(queue_name);

      channel.consume(queue_name, async (message) => {
        try {
          if (!message) return;

          const code = JSON.parse(message?.content.toString());

          console.log('1');
          const { src, stdin, lang, timeout, submission_id } = code;
          redisClient.set(submission_id, 'Processing...');

          // cwd for current code - /temp/{code.folder_name} == code_cwd
          const code_cwd = `/temp/${submission_id}`;
          // @ts-ignore
          const source_path = `${code_cwd}/source.${extensions[lang]}`;
          const input_path = `${code_cwd}/input.txt`;
          const output_path = `${code_cwd}/output.txt`;

          console.log('2');

          // create code_cwd dir and files into it

          await fs.promises.mkdir(code_cwd, {
            recursive: true,
          });
          await fs.promises.writeFile(source_path, src);
          await fs.promises.writeFile(input_path, stdin || '');
          await fs.promises.writeFile(output_path, '');

          console.log('3');

          const command = `python3 code_runner.py ${source_path} ${input_path} ${output_path} ${code_cwd} ${lang} ${timeout}`;

          const run = (command: any) =>
            new Promise((resolve, reject) => {
              console.log('6');

              exec(command, (err, stdout, stderr) => {
                if (err) {
                  console.log('err from executer: ', err);
                  reject(err);
                } else {
                  let status = { stdout: stdout, stderr: stderr };
                  resolve(status);
                }
              });
            });

          const output = await run(command);
          console.log('7');

          // read the content from output file, shove it on redis
          const data = await fs.promises.readFile(output_path, 'utf-8');
          console.log('8');

          // delete code_cwd

          // await fs.promises.rm(code_cwd, {
          //   recursive: true,
          // });

          console.log('9');

          // redisClient.set(submission_id, 'Processing');
          console.log('10');
          let result = {
            output: data,
            // @ts-ignore
            stderr: output.stderr,
            // @ts-ignore
            status: output.stdout,
            submission_id,
          };
          console.log('result:', result);
          redisClient.set(submission_id.toString(), JSON.stringify(result));
          console.log('11');
          channel.ack(message);
          console.log('12');
        } catch (error) {
          console.error('error: ', error);
        }
      });
    });
  })
  .catch((err) => {
    console.log('error while connecting to redis: ', err);
  });
