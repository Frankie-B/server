const express = require('express');
const app = express();
const User = require('../models/User');
const bcrypt = require('bcrypt');

app.post('/signup', (req, res, next) => {
  const { username, password, firstName, lastName, email } = req.body;
  bcrypt.hash(password, 10, function (error, hash) {
    if (error) {
      next('Hashing error');
    } else {
      User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: hash,
      })
        .then((user) => {
          res.json(user);
        })
        .catch((error) => {
          res.json(error);
        });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({
    username: username,
  }).then((user) => {
    if (!user)
      res.status(403).json({
        user: 'username does not exist',
      });
    else {
      bcrypt.compare(password, user.password, function (err, correct) {
        if (correct) {
          req.session.currentUser = user;
          res.status(200).json(user);
        } else {
          res.status(403).json({
            user: 'wrong password',
          });
        }
      });
    }
  });
});

app.delete('/logout', (req, res) => {
  req.session.destroy(); //destroys the session with the user data in it
  res.status(200).send('logged out');
});

module.exports = app;
