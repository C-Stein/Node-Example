'use strict'

const {Router} = require('express')
const router = Router()

const contact = require('../models/contact')
const order = require('../models/order')
const Size = require('../models/Size')
const topping = require('../models/topping')

router.get('/', (req, res) => { //adding a "next" function here creates a middlewware 
  res.render('index', {title: "home"})
})

router.get('/about', (req, res) => {
  res.render('about', {title: "about"})
})

router.get('/contact', (req, res) => {
  res.render('contact', {title: "contact"})
})

router.post('/contact', (req, res, next) => {
  contact
  .create(req.body)
  .then(() => res.redirect('/'))
  .catch(next)
  
})

router.get('/404', (req, res) => {
  res.render('404')
})

router.get('/order', (req, res, err) =>
  Promise
    .all([
      Size.find().sort({ inches: 1 }),
      topping.find().sort({ name: 1 })
    ])
    .then(([sizes, toppings]) =>
      res.render('order', {page: 'Order', sizes, toppings})
    )
    .catch(err)
)

router.post('/order', (req, res, next) => {
  order
  .create(req.body)
  .then(() => res.redirect('/'))
  .catch(next)
})

module.exports = router








