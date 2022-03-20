import { useEffect, useState } from 'react';
import './CurrencyExchange.css';
import Axios from 'axios';
import images from '../../assets/icons';
import Select from 'react-select';
///custom component to show a message when a transaction was saved, then hide
import Expire from './Expire';
const messageDelay = '5000'; ///Duration that the message appears on screen

function CurrencyExchange() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [cryptoOptions, setCryptoOptions] = useState([]);
  const [isShown, setIsShown] = useState(false);
  const [input, setInput] = useState(1);
  const [output, setOutput] = useState(1);
  ///Initialize currency from and currency to
  const [to, setTo] = useState([
    {
      value: 'USD',
      text: 'USD',
      icon: <img src={images.usd} alt='USD' />,
    },
  ]);
  const [from, setFrom] = useState({
    value: 'BTC',
    text: 'BTC',
    icon: <img src={images.btc} alt='BTC' />,
  });
  ///

  useEffect(() => {
    fillOptions();
  }, []);

  ///Fill all options for currency from and currency to
  const fillOptions = () => {
    setCurrencyOptions([
      {
        value: 'USD',
        text: 'USD',
        icon: <img src={images.usd} alt='USD' />,
      },
      {
        value: 'GBP',
        text: 'GBP',
        icon: <img src={images.gbp} alt='GBP' />,
      },
      {
        value: 'EUR',
        text: 'EUR',
        icon: <img src={images.eur} alt='EUR' />,
      },
    ]);
    setCryptoOptions([
      {
        value: 'BTC',
        text: 'BTC',
        icon: <img src={images.btc} alt='BTC' />,
      },
      {
        value: 'ETH',
        text: 'ETH',
        icon: <img src={images.eth} alt='ETH' />,
      },
    ]);
  };

  ///Save transaction to database
  const createTransaction = () => {
    console.log(isShown);
    Axios.post('http://localhost:3001/createTransaction', {
      transactionDate: new Date(),
      currencyFrom: from,
      amount1: input,
      currencyTo: to,
      amount2: output,
      type: 'Exchanged',
    }).then((response) => {
      ///then reset the input and output and show the message for the exchange being recorded
      setInput(1);
      setOutput(1);
      setIsShown(true);
    });
  };

  ///get the rate for the currencies being exchanged
  const getCryptoRate = (tempfrom, tempto, tempinput) => {
    if (typeof tempfrom === 'string' && typeof tempto === 'string') {
      Axios.post('http://localhost:3001/getLastRate', {
        currencyFrom: tempfrom,
        currencyTo: tempto,
      }).then((response) => {
        ///calculate the amount based on the rate and the input
        setOutput(tempinput * response.data[0].amount2);
      });
    }
  };

  return (
    <div className='grid'>
      <div className='heading'>
        <h1>Exchange</h1>
      </div>
      <div className='container'>
        <div>
          <p>Currency From</p>
          <Select
            className='select'
            value={from.text}
            options={cryptoOptions}
            onChange={(event) => {
              setFrom(event.value);
              getCryptoRate(event.value, to, input);
            }}
            getOptionLabel={(e) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {e.icon}
                <span style={{ marginLeft: 5 }}>{e.text}</span>
              </div>
            )}
          />
        </div>
        <div>
          <p>Amount</p>
          <input
            type='number'
            value={input}
            placeholder='Enter the amount'
            onChange={(e) => {
              setInput(e.target.value);
              getCryptoRate(from, to, e.target.value);
            }}
          />
        </div>
        <div>
          <h2 className='equalSign'>=</h2>
        </div>
        <div>
          <p>Currency To</p>
          <Select
            className='select'
            value={to.text}
            options={currencyOptions}
            onChange={(event) => {
              setTo(event.value);
              getCryptoRate(from, event.value, input);
            }}
            getOptionLabel={(e) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {e.icon}
                <span style={{ marginLeft: 5 }}>{e.text}</span>
              </div>
            )}
          />
        </div>
        <div>
          <p>Amount</p>
          <input
            type='number'
            value={output}
            placeholder='Enter the amount'
            onChange={(e) => setOutput(e.target.value)}
          />
        </div>
        <div>
          <button onClick={createTransaction} className='savebutton'>
            Save
          </button>
        </div>
      </div>
      {isShown ? (
        <Expire delay={messageDelay}>Exchange Submitted</Expire>
      ) : null}
    </div>
  );
}

export default CurrencyExchange;
