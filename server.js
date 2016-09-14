"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
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

//Middlewares

app.use(({ method, url, headers: { 'user-agent': agent } }, res, next) => {
  console.log(`[${new Date()}] "${cyan(`${method} ${url}`)}" "${agent}"`)
  next()
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false})) //gives you a req.body


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
