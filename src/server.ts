import express from 'express';
import cors from 'cors';
import { publishToQueue } from './lib/publisher';
import { consumer } from './lib/consumer';
import { randomBytes } from 'crypto';

const app = express();

app.use(cors());

app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(express.json({ limit: '50mb' }));

app.get('/publish', async (req, res) => {
  let data = {
    src: req.body.src,
    stdin: req.body.stdin,
    lang: req.body.lang,
    timeout: req.body.timeout,
    folder: Math.random().toString().slice(2),
  };

  await publishToQueue('jobs', data);

  return res.json(req.query);
});

app.get('/consumer', async (req, res) => {
  consumer('jobs', (message) => {
    if (!message) return;
    console.log(JSON.parse(message.content.toString()));
  });
  res
    .json({
      hello: ' xklsd',
    })
    .end();
  // res.json(JSON.parse(mesage.content.toString()));
});

export { app, app as serverInstance };
