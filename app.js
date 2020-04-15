require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(
  cors({
    origin: ['https://localhost:3005', 'http://localhost:3005'],
    credentials: true,
  })
);

app.use(
  session({
    secret: 'basic-auth-secret',
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // (1 day) time to live = how long the cookie will be valid
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
    res.redirect('/user/login');
  }
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/home'));
app.use('/signup', require('./routes/user'));
app.use('/join', require('./routes/join'));

module.exports = app;
