const express = require('express');
const app = express();
const User = require('../models/User');
const bcrypt = require('bcrypt');

app.post('/', (req, res, next) => {
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
  })
    .then((user) => {
      if (!user) {
        res.json({ message: 'Invalid Credentials' });
      } else {
        bcrypt.compare(password, user.password, function (
          error,
          correctPassword
        ) {
          if (error) {
            next('Hash compare error');
          } else if (!correctPassword) {
            res.json({ message: 'Invalid Credentials' });
          } else {
            req.session.currentUser = user;
            res.json({ message: '/join' });
          }
        });
      }
    })
    .catch((error) => {
      res.json(error);
    });
});

// app.get('/profile', (req, res) => {
//   res.render('user/profile');
// });

// app.get('/profile/:userId', (req, res) => {
//   User.findById(req.session.currentUser._id)
//     .then((userData) => {
//       res.render('user/profile', { user: userData });
//       console.log(user, userData);
//     })
//     .catch((err) => {
//       console.log('User not found');
//     });
// });

module.exports = app;
