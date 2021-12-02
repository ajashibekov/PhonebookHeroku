const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('runValidators', true)

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true, unique: true },
  number: { type: String, validate: {
    validator: function(v) {
      return /\d{8,}/.test(v)
    },
    message: props => `${props.value} is not a valid number!`
  }, required: true }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)