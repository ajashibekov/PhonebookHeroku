const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let message = `<p>Phonebook has info for ${persons.length} people</p>`
    message += `<p>${new Date()}</p>`
    response.send(message)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person)
        response.json(person)
    else 
        response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name)
      return response.status(400).send('No name provided')
    if(!body.number)
      return response.status(400).send('No number provided')
    if(persons.find(p => p.name === body.name))
      return response.status(400).send('Entry with such name already exists!')
    
    let id = Math.floor(Math.random() * 1e7)
    while(persons.find(p => p.id === id) !== undefined){
      id++
    }
    let toAdd = {id: id, ...body}
    persons = persons.concat(toAdd)
    response.json(toAdd)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})