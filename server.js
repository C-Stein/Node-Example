"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const { cyan, red } = require('chalk')

const { connect } = require('./database')

const routes = require('./routes/') //ending in "/" defaults to "index"
const db = require('./database')

 const port = process.env.PORT || 3000
 app.set('port', port)

app.set('view engine', 'pug');
app.set('views', 'views');

if (process.env.NODE_ENV !== 'production') {
  app.locals.pretty = true;
}

app.locals.errors = {}
app.locals.body = {}

//Middlewares
app.use(bodyParser.urlencoded({ extended: false})) //gives you a req.body

app.use(session({
  'store': new RedisStore({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }),
  'secret': 'supersecretkey' //fine to put this on github
}))

app.use((req, res, next) => {
  app.locals.email = req.session.email
  console.log("user-mail: ", app.locals.email);
  next()
})

app.use(({ method, url, headers: { 'user-agent': agent } }, res, next) => {
  console.log(`[${new Date()}] "${cyan(`${method} ${url}`)}" "${agent}"`)
  next()
})


app.use(express.static('public'))


app.use(routes)//"routes" has to be a function



//404 catch and forward to the error handler
app.use((req, res) => {
  // const err = Error('not found')
  // err.status = 404
  // next(err)
  res.render('404')
})

//error handling middlewares
app.use((
    err,
    { method, url, headers: { 'user-agent': agent } },
    res,
    next
  ) => {
    res.sendStatus(err.status || 500)

    const timeStamp = new Date()
    const statusCode = res.statusCode
    const statusMessage = res.statusMessage

    console.error(
      `[${timeStamp}] "${red(`${method} ${url}`)}" Error (${statusCode}): "${statusMessage}"`
    )
    console.error(err.stack)
  }
)

//listen
connect()
  .then(() => {
    app.listen(port, () => {
    console.log(`Hey, I'm listening on port ${port}`);
    })
  })
  .catch(console.error)
