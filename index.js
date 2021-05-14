require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { restart } = require('nodemon')

const app = express()

morgan.token('body', (req, _) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({error: 'malformatted id'})
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person
        .deleteOne({_id: id})
        .then(person => {
            res.status(204).end()
        })
        .catch(err => {
            console.log(err)
            res.status(500).end()
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({error: 'name is missing'})
    }

    if (!body.number) {
        return res.status(400).json({error: 'number is missing'})
    }
    
    const person = new Person({name: body.name, number: body.number})

    person.save().then(savedPerson => {
        console.log(`added ${body.name} number ${body.number} to phonebook`)
        res.json(savedPerson)
    })
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people<br /><br /> ${new Date()}`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).json({error: 'unkown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}.`)
})