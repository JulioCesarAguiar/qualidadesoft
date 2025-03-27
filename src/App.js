import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        setCurrencies(Object.keys(response.data.rates));
      } catch (error) {
        console.error('Erro ao buscar moedas:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const convertCurrency = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const rate = response.data.rates[toCurrency];
      setResult((amount * rate).toFixed(2));
    } catch (error) {
      console.error('Erro na conversão:', error);
      setResult('Erro na conversão');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Conversor de Moeda</h1>
      <div className="converter-container">
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Valor"
          />
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <button onClick={convertCurrency} disabled={loading}>
          {loading ? 'Convertendo...' : 'Converter'}
        </button>
        {result && (
          <div className="result">
            <h2>Resultado:</h2>
            <p>{amount} {fromCurrency} = {result} {toCurrency}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 