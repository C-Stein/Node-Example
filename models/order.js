'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('order', {
  name : String,
  email: String,
  phone: String,
  size: Number,
  toppings: Array
})