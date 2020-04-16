require('dotenv').config();
const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

app.use(
  cors({
    allowedHeaders: ['authorization', 'Content-Type'],
    exposedHeaders: ['authorization'],
    origin: [
      process.env.client_origin_a,
      process.env.client_origin_b,
      process.env.server_origin_a,
      process.env.server_origin_b,
      process.env.socket_origin_a,
      process.env.socket_origin_b,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60,
    }),
  })
);

mongoose
  .connect(process.env.db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(`Connected to MongoDB name: "${x.connections[0].name}"`);
  })
  .catch((error) => {
    console.log('Unexpected error, connection failed!', error);
  });

function protect(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.json({ send: '/login' });
  }
}

app.use('/join', protect);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/home'));
app.use('/', require('./routes/user'));
app.use('/', require('./routes/user'));
app.use('/join', require('./routes/join'));

module.exports = app;
