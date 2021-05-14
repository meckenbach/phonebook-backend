const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('please provide password: node mongo.js <password> [<name> <number>]')
  process.exit(1)
}

const [,, password, name, number] = process.argv

const url = `mongodb+srv://fullstack:${password}@cluster0.fxota.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (!name || !number) {
  Person.find({}).then(res => {
    console.log('phonebook:')
    res.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({ name, number })
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}


