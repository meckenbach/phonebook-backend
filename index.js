require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', (req,) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const person = new Person({ name: body.name, number: body.number })

  person
    .save()
    .then(savedPerson => {
      console.log(`added ${body.name} number ${body.number} to phonebook`)
      res.json(savedPerson)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.status(200).json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.get('/info', (req, res) => {
  Person.find({}).then(people => {
    res.send(`Phonebook has info for ${people.length} people<br /><br />${new Date()}`)
  })
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unkown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}.`)
})