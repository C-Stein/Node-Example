'use strict'

const db = require('./database')
const Size = require('./models/size')
//const Topppings = require('./models/toppings')

db.connect()
  .then(() => {
    Size.insertMany([
      {name: 'small', inches: 10},
      {name: 'medium', inches: 12},
      {name: 'large', inches: 14},
      {name: 'merica', inches: 50},

      ])
}
)