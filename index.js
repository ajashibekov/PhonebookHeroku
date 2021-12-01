require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { count } = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
      response.json(result)
    })
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({}, (err, res) => {
    if(!err){
    let message = `<p>Phonebook has info for ${res} people</p>`
    message += `<p>${new Date()}</p>`
    response.send(message)
    }
    else next(er)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then((res) => {
      response.json(res)
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if(!body.name)
      return response.status(400).send({error: 'No name provided'})
    if(!body.number)
      return response.status(400).send({error: 'No number provided'})
    
    const newPers = new Person({
      name: body.name,
      number: body.number
    })
    newPers.save().then((res) => {
      response.json(res);
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id)
    Person.findByIdAndRemove(request.params.id).then(res => {
      console.log(`Deleted entry with id ${request.params.id}`)
      response.status(204).end()
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  if(!request.body.number)
    return response.status(400).send({error: 'No number provided!'})
  Person.findOneAndUpdate({id: request.params.id}, {number: request.body.number}, {new: true})
    .then(res => {
      console.log(res)
      response.json(res)
    }).catch(error => next(error))
})

const unknownEndpointHandler = (req, res) => {
  res.status(404).send({error: 'Unknown endpoint'})
}

app.use(unknownEndpointHandler)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    res.status(400).send({error: 'malformatted query'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})