const morgan = require('morgan')
const logger = require('./logger')

morgan.token('data', (req) => {
  return JSON.stringify(req.body)
})

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms :data')

const unknownEndpointHandler = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if(error.name === 'CastError'){
    res.status(400).send({ error: 'malformatted query' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = {
  morganMiddleware,
  unknownEndpointHandler,
  errorHandler
}