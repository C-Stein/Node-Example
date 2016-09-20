'use strict'

const {Router} = require('express')
const bcrypt = require('bcrypt')
const router = Router()

const contact = require('../models/contact')
const order = require('../models/order')
const Size = require('../models/Size')
const topping = require('../models/topping')
const User = require('../models/user')

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

router.post('/order', ({ body }, res, err) =>
  Order
    .create(body)
    .then(() => res.redirect('/'))
    .catch(({ errors })  =>
      Promise.all([ // retrieve sizes and toppings again,
        Promise.resolve(errors), // but pass the errors along as well
        Size.find().sort({ inches: 1 }),
        Topping.find().sort({ name: 1 }),
      ])
    )
    .then(([
        errors,
        sizes,
        toppings,
      ]) =>
      // UI/UX additions
      // send errors to renderer to change styling and add error messages
      // also, send the req.body to use as initial form input values
      res.render('order', { page: 'Order', sizes, toppings, errors, body })
    )
    .catch(err)
)

router.get('/login', (req, res) =>
    res.render('login')
)

router.post('/login', ({ session, body: { email, password } }, res, err) => {
  User.findOne({ email })
    .then(user => {
      if (user) {
        return new Promise((resolve, reject) => {
          console.log("password:", password, "user.password:", user.password);
          bcrypt.compare(password, user.password, (err, matches) => {
            if (err) {
              reject(err)
            } else {
              console.log("line 87. matches:", matches);
              resolve(matches)
            }
          })
        })
      } else {
        res.render('login', { msg: 'Email does not exist in our system' })
      }
    })
    .then((matches) => {
      console.log("matches: ", matches);
      if (matches) {
        console.log("made it to line 96!!!!!!!!!!!!!");
        session.email = email
        res.redirect('/')
      } else {
        res.render('login', { msg: 'Password does not match' })
      }
    })
    .catch(err)
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', ({ body: { email, password, confirmation } }, res, err) => {
  if (password === confirmation) {
    User.findOne({ email })
      .then(user => {
        if (user) {
          res.render('register', { msg: 'Email is already registered' })
        } else {
          return new Promise((resolve, reject) => {
            bcrypt.hash(password, 15, (err, hash) => {
              if (err) {
                reject(err)
              } else {
                resolve(hash)
                debugger;
              }
            })
          })
        }
      })
      .then(hash => User.create({ email, password: hash }))
      .then(() => res.redirect('/login'), { msg: 'User created' })
      .catch(err)
  } else {
    res.render('register', { msg: 'Password & password confirmation do not match' })
  }
})

router.get('/logout', (req, res) => {
  if (req.session.email) {
    res.render('logout', {page: 'Logout'})
  } else {
    res.redirect('/login')
  }
})

router.post('/logout', (req, res) => {
  //logout
  req.session.destroy((err) => {
    if(err) throw err
    res.redirect('/login', {msg: 'You have successfully logged out'})
  })
})

module.exports = router








