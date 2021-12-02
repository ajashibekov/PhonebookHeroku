const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

personsRouter.get('/info', (request, response, next) => {
  Person.countDocuments({}, (err, res) => {
    if(!err){
      let message = `<p>Phonebook has info for ${res} people</p>`
      message += `<p>${new Date()}</p>`
      response.send(message)
    }
    else next(err)
  })
})

personsRouter.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then((res) => {
    response.json(res)
  }).catch(error => next(error))
})

personsRouter.post('/api/persons', (request, response, next) => {
  const body = request.body
  if(!body.name)
    return response.status(400).send({ error: 'No name provided' })
  if(!body.number)
    return response.status(400).send({ error: 'No number provided' })

  const newPers = new Person({
    name: body.name,
    number: body.number
  })
  newPers.save().then((res) => {
    response.json(res)
  }).catch(error => next(error))
})

personsRouter.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then( () => {
    response.status(204).end()
  }).catch(error => next(error))
})

personsRouter.put('/api/persons/:id', (request, response, next) => {
  if(!request.body.number)
    return response.status(400).send({ error: 'No number provided!' })
  Person.findByIdAndUpdate(request.params.id, { number: request.body.number }, { new: true })
    .then(res => {
      response.json(res)
    }).catch(error => next(error))
})

module.exports = personsRouter