'use strict'

const mongoose = require('mongoose');

//const MONGODB_URL = 'mongodb://localhost:27017/pizzaApp'
const MONGODB_URL = 'mongodb://pizzaGuy:pizza4m@ds033096.mlab.com:33096/pizzapp'

mongoose.Promise = Promise;

module.exports.connect = () => mongoose.connect(MONGODB_URL)

