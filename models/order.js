'use strict'

const mongoose = require('mongoose')
const HTML_5_EMAIL_VALIDATION = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

module.exports = mongoose.model('order', {
  name : { type: String, required: true},
  email: { type: String, 
            required: true,
            lowercase: true,
            match: [HTML_5_EMAIL_VALIDATION, 'please fill in a valid email address']},
  phone: { type: String, required: [true, 'please enter your phone number']},
  size: { type: Number, required: [true, 'please enter a valid size']},
  toppings: { type: [String], default: ['cheese']}
})