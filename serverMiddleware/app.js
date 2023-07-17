import session from 'express-session';
import bodyParser from 'body-parser';
import express from 'express';
import Redis from 'redis-tag-cache';
import RedisStore from 'connect-redis';

const options = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || null,
  db: process.env.REDIS_DATABASE || 0
};

const redisClient = new Redis({ redis: options });

const app = express();
const redisStore = new RedisStore({
  client: redisClient.redis,
  prefix: 'cart:'
});

app.use(
  session({
    name: 'vsf-odoo-cart',
    store: redisStore,
    secret: process.env.INVALIDATION_KEY,
    saveUninitialized: false,
    rolling: false,
    cookie: { maxAge: 1000 * 60 * 60, httpOnly: false },
    resave: false
  })
);

app.use(bodyParser.json());
export default app;
