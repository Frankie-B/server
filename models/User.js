// Extended User Model with relations.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var validate = require('mongoose-validator');

const validateName = [
  validate({
    validator: 'isLength',
    arguments: [2, 50],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
  }),
  validate({
    validator: function (v) {
      return /^[A-Za-z]+$/.test(v);
    },
    passIfEmpty: false,
    message: 'Name should contain alphabetic characters only',
  }),
];

const validateEmail = [
  validate({
    validator: function (v) {
      return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        v
      );
    },
    passIfEmpty: false,
    message: 'Please enter a valid email address',
  }),
];

const validateUsername = [
  validate({
    validator: 'isLength',
    arguments: [3, 20],
    message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters',
  }),
  validate({
    validator: function (v) {
      return /^[A-Za-z0-9_]{1,15}/.test(v);
    },
    passIfEmpty: false,
    message: 'Username can only include letters and numbers and underscores',
  }),
];

// const validatePassword = [
//   validate({
//     validator: 'isLength',
//     arguments: [5, 26],
//     message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters',
//   }),
//   validate({
//     validator: function (v) {
//       return /[A-Za-z0-9]+$/.test(v);
//     },
//     passIfEmpty: false,
//     message: 'password can  contain alphanumeric characters',
//   }),
// ];

const userSchema = new Schema({
  firstName: {
    type: String,
    validate: validateName,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    validate: validateName,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    validate: validateEmail,
    trim: true,
    required: true,
  },
  username: {
    type: String,
    validate: validateUsername,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    // validate: validatePassword,
    // trim: true,
    // required: true,
  },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
