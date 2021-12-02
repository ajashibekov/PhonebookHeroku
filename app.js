const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const router = require('./controllers/persons')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to mongo')
  }).catch((err) => console.log('Error connecting to mongo: ', err))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(middleware.morganMiddleware)
app.use('/', router)
app.use(middleware.unknownEndpointHandler)
app.use(middleware.errorHandler)

module.exports = app