const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req, _) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-12345678"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-532425"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-387393"
    },
    {
        id: 4,
        name: "Marry Poppendick",
        number: "39-32-392387"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = +req.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        return res.json(person)
    }
    res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = +req.params.id
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

function generateId () {
    const max = 10000
    return Math.floor(Math.random() * max)
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({error: 'name is missing'})
    }

    if (!body.number) {
        return res.status(400).json({error: 'number is missing'})
    }

    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons.concat(person)

    res.json(person)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people<br /><br /> ${new Date()}`)
})

const unknownEndpoint = (req, res) => {
    res.status(404).json({error: 'unkown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}.`)
})