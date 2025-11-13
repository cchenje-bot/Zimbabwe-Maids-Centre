import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Currency } from '../types';

interface CurrencyConverterModalProps {
  onClose: () => void;
}

const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState<Currency>(Currency.USD);
  const [toCurrency, setToCurrency] = useState<Currency>(Currency.ZAR);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const handleConvert = async () => {
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    const prompt = `What is the current exchange rate from ${fromCurrency} to ${toCurrency}? Provide the answer as a JSON object with a single key "rate" which has the numeric exchange rate.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rate: {
                type: Type.NUMBER,
                description: 'The numeric exchange rate.',
              },
            },
            required: ['rate'],
          },
        },
      });

      const data = JSON.parse(response.text);
      const rate = data.rate;
      if (rate) {
        const convertedAmount = (Number(amount) * rate).toFixed(2);
        setResult(`${convertedAmount} ${toCurrency}`);
      } else {
        setError('Could not retrieve exchange rate.');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to fetch exchange rate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Currency Converter</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fromCurrency" className="block text-sm font-medium text-slate-700 mb-1">From</label>
              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as Currency)}
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="toCurrency" className="block text-sm font-medium text-slate-700 mb-1">To</label>
              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as Currency)}
                className="w-full p-2 border border-slate-300 rounded-md"
              >
                {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleConvert}
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-400 flex items-center justify-center"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Convert'}
          </button>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {result && (
            <div className="text-center bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-600">Converted Amount:</p>
              <p className="text-2xl font-bold text-emerald-600">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterModal;