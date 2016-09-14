'use strict'

const mongoose = require('mongoose');

const MONGODB_URL = 'mongodb://localhost:27017/pizzaApp'

mongoose.Promise = Promise;

module.exports.connect = () => mongoose.connect(MONGODB_URL)

