'use strict'
const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => { //adding a "next" function here creates a middlewware 
  res.render('index', {title: "home"})
})

router.get('/about', (req, res) => {
  res.render('about', {title: "about"})
})

router.get('/contact', (req, res) => {
  res.render('contact', {title: "contact"})
})

router.post('/contact', (req, res) => {
  //console.log("req.body", req.body)
  res.redirect('/')
})

router.get('/404', (req, res) => {
  
  res.render('404')
})

module.exports = router