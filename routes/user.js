const express = require('express');
const app = express();
const User = require('../models/User');
const bcrypt = require('bcrypt');

app.get('/signup', (req, res) => {
  res.render('user/signup');
});

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
          res.redirect('/user/login');
        })
        .catch((error) => {
          res.send('User not create', error);
        });
    }
  });
});

app.get('/login', (req, res) => {
  res.render('user/login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({
    username: username,
  })
    .then((user) => {
      if (!user) {
        res.send('Invalid Credentials');
      } else {
        bcrypt.compare(password, user.password, function (
          error,
          correctPassword
        ) {
          if (error) {
            next('Hash compare error');
          } else if (!correctPassword) {
            res.send('Invalid Credentials');
          } else {
            req.session.currentUser = user;
            res.redirect('/join');
          }
        });
      }
    })
    .catch((error) => {
      res.send('Error not logged in');
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
