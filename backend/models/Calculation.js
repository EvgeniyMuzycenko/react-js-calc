const { Schema, model } = require('mongoose')

const Calculation = new Schema({
  sum: {
    type: String,
  },

  downPayment: {
    type: String
  },

  interestRate: {
    type: String
  },

  loanTerm: {
    type: String
  },

  monthlyPayment: {
    type: String
  },

  requiredIncome: {
    type: String
  },

  email: {
    type: String
  },

  date: {
    type: String
  },

  name: {
    type: String
  },

  type: {
    type: String
  },

  incomeDeposit: {
    type: String
  },

  capitalization: {
    type: String
  },
  months: {
    type: String
  },
  years: {
    type: String
  }

})
module.exports = model('Calculation', Calculation)