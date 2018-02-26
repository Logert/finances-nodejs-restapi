const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { MongoClient } = require('mongodb');
const config = require('./config');
const router = require('./routers');

const app = express();

app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/api', router);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: { status: err.status || 500, message: err.message } });
  next();
});

MongoClient.connect(config.dbUrl, {
  reconnectTries: Number.MAX_VALUE, // Бесконечная проверка соединения
  reconnectInterval: 1000,
}, (err, client) => {
  if (err) {
    console.error('Error connect to DB');
  } else {
    app.locals.db = client.db(config.dbName);
    app.locals.db.on('close', () => {
      console.error('Mongo connection closed');
    });
    app.locals.db.on('reconnect', () => {
      console.error('Mongo reconnected');
    });
    app.locals.db.on('timeout', () => {
      console.log('Mongo connection lost');
    });
    app.listen(config.port, () => console.log(`App running on 127.0.0.1: ${config.port}`));
  }
});

