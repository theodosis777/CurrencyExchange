const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const TransactionModel = require('./models/Transaction');
const cors = require('cors');
const app = express();
const PORT = 3001;
const updateInterval = 1000 * 60 * 5; ///UDATE INTERVAL FOR RATES  miliseconds*seconds*minutes

app.use(express.json());
app.use(cors());
mongoose.connect(
  'mongodb+srv://theodosis:theodosis@cluster0.wazy6.mongodb.net/CurrencyConverter?retryWrites=true&w=majority'
); ///CONNECTION STRING WITH MONGO DB

app.listen(PORT, console.log(`server running on port ${PORT}`));

///RECURRING FUNCTION TO UPDATE THE RATES AFTER THE INTERVAL
setInterval(function () {
  const currenciesList = ['USD', 'EUR', 'GBP'];

  for (currency in currenciesList) {
    saveRate(currenciesList[currency]);
  }
}, updateInterval);

///RETRIVES RATES FROM API AND SAVES TO MONGO DB
async function saveRate(currency) {
  await axios
    .get(
      `http://api.coinlayer.com/api/live?access_key=6baba29860f6e6bf95edcf0f9bd604d7&target=${currency}`
    )
    .then((response) => {
      for (const key in response['data']['rates']) {
        if (key === 'BTC' || key === 'ETH') {
          //CREATE OBJECT
          const rateObj = {
            transactionDate: new Date(),
            currencyFrom: key,
            amount1: 1,
            currencyTo: currency,
            amount2: response['data']['rates'][key].toFixed(0),
            type: 'Live',
          };

          saveRateToDatabase(rateObj);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

///SAVES THE NEW RATE TO DATABASE
async function saveRateToDatabase(rateObj) {
  const newRate = new TransactionModel(rateObj);

  await newRate.save();
}

///CREATES A NEW TRANSACTION (WHEN THE SAVE BUTTON IS CLICKED)
app.post('/createTransaction', async (req, res) => {
  const Transaction = req.body;
  const newTransaction = new TransactionModel(Transaction);

  await newTransaction.save();

  res.json(newTransaction);
});

///RETRIEVES TRANSACTIONS FROM DATABASE
app.get('/getTransactions', (req, res) => {
  TransactionModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  }).sort({ transactionDate: -1 }); ///DESC ORDER
});

///RETRIEVES THE LAST LIVE RATE WHEN THE USER CHANGES CURRENCIES
app.post('/getLastRate', (req, res) => {
  var query = {
    currencyFrom: req.body.currencyFrom,
    currencyTo: req.body.currencyTo,
    type: 'Live',
  };
  TransactionModel.find(query, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  })
    .sort({ transactionDate: -1 })
    .limit(1);
});
