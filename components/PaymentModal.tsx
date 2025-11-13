import React, { useState } from 'react';
import { paymentDetails } from '../constants';

type PaymentMethod = 'mobile' | 'international' | 'cash';

interface PaymentModalProps {
  employeeName: string;
  fee: number;
  onClose: () => void;
  onSubmit: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ employeeName, fee, onClose, onSubmit }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const renderInstructions = () => {
    switch (selectedMethod) {
      case 'mobile':
        return (
          <div className="bg-slate-100 p-4 rounded-lg text-left">
            <p><strong>Account:</strong> {paymentDetails.mobileMoney.account}</p>
            <p className="text-sm mt-2">{paymentDetails.mobileMoney.instructions}</p>
          </div>
        );
      case 'international':
        return (
          <div className="bg-slate-100 p-4 rounded-lg text-left">
            {/* Fix: Corrected property access for PayPal email. */}
            <p><strong>PayPal Email:</strong> <span className="font-mono text-emerald-600">{paymentDetails.paypal.email}</span></p>
            <p className="text-sm mt-2">{paymentDetails.international.instructions}</p>
          </div>
        );
      case 'cash':
        return (
          <div className="bg-slate-100 p-4 rounded-lg text-left">
            <p><strong>Address:</strong> {paymentDetails.cash.address}</p>
            <p className="text-sm mt-2">{paymentDetails.cash.instructions}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h3 className="text-2xl font-bold mb-2 text-slate-800">Complete Hire</h3>
        <p className="text-slate-600 mb-4">
          You are hiring <strong>{employeeName}</strong>.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mb-6">
          <p className="text-slate-700">One-time placement fee:</p>
          <p className="text-3xl font-bold text-emerald-600">${fee} USD</p>
        </div>
        
        <h4 className="text-lg font-semibold mb-4">Select Payment Method</h4>
        <div className="space-y-3 mb-6">
          <button
            onClick={() => setSelectedMethod('mobile')}
            className={`w-full p-4 border-2 rounded-lg text-left font-semibold ${selectedMethod === 'mobile' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}
          >
            {paymentDetails.mobileMoney.name}
          </button>
          <button
            onClick={() => setSelectedMethod('international')}
            className={`w-full p-4 border-2 rounded-lg text-left font-semibold ${selectedMethod === 'international' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}
          >
            {paymentDetails.international.name}
          </button>
          <button
            onClick={() => setSelectedMethod('cash')}
            className={`w-full p-4 border-2 rounded-lg text-left font-semibold ${selectedMethod === 'cash' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}
          >
            {paymentDetails.cash.name}
          </button>
        </div>
        
        {selectedMethod && renderInstructions()}

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!selectedMethod}
            className="py-2 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;