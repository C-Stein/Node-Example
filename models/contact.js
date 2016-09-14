'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('contact', {
  name : String,
  email: String,
  phone: String,
  message: String
})