const { Schema, model } = require('mongoose')

const Calculator = new Schema({
  type: {
    type: String
  },
  status: {
    type: String
  },
  interest_rate: {
    type: String
  },
  name: {
    type: String
  }
})

module.exports = model('Calculator', Calculator)