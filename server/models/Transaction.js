const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionDate: {
    type: Date,
    required: true,
  },
  currencyFrom: {
    type: String,
    required: true,
  },
  amount1: {
    type: Number,
    required: true,
  },
  currencyTo: {
    type: String,
    required: true,
  },
  amount2: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const TransactionModel = mongoose.model('Transaction', TransactionSchema);
module.exports = TransactionModel;
