import express from 'express';
import cors from 'cors';

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

app.post('/api/v1/codes/submit', (req, res) => {
  return res.json(req.query);
});

export { app, app as serverInstance };
