const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Provide mongo db password as the third argument')
}

const password = process.argv[2]
const dbName = 'phonebook'

const url=`mongodb+srv://mongo:${password}@cluster0.bqid6.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = new mongoose.model('Person', personSchema)

const fetchAll = () => {
    Person.find({}).then((result) => {
        console.log('Phonebook')
        result.forEach(r => console.log(r))
        mongoose.connection.close()
    })
}

const addNewPerson = (name, phone) => {
    const newPers = new Person({
        name: name, 
        number: phone
    })
    newPers.save().then((res) => {
        console.log(`Added ${name} with number ${number} to the phonebook`)
        mongoose.connection.close()
    })
}

if(process.argv.length == 3){
    fetchAll()
} else if (process.argv.length == 5){
    addNewPerson(process.argv[3], process.argv[4])
}