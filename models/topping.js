'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('topping', {
  name : String,
})