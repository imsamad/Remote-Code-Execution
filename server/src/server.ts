import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { publishToQueue } from './lib/publisher';
import { redisInstance } from './redis';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.json({ limit: '50mb' }));

app.post('/submit', async (req, res) => {
  let data = {
    src: req.body.src,
    stdin: req.body.stdin,
    lang: req.body.lang,
    timeout: req.body.timeout,
    submission_id: Math.random().toString().slice(2),
  };

  await publishToQueue('jobs', data);

  return res.json({
    submission_id: data.submission_id,
  });
});

app.get('/results/:submission_id', async (req, res) => {
  const submission_id = req.params.submission_id;

  const data = await redisInstance.client.get(submission_id);

  res.status(202).json(JSON.parse(data));
});

export { app, app as serverInstance };
