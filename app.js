require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { DB_URL, PORT } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use('*', cors({
  origin: ['https://yixellet.github.io', 'http://localhost:8080'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'origin',
    'x-access-token',
    'authorization',
    'credentials',
  ],
  credentials: true,
}));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
