import React, { useState } from 'react';
import { paymentDetails, ACCESS_FEE } from '../constants';

interface AccessPaymentModalProps {
  onClose: () => void;
  onSubmit: (confirmationCode: string) => void;
}

const AccessPaymentModal: React.FC<AccessPaymentModalProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState<'selectMethod' | 'otherMethodsInfo' | 'enterCode'>('selectMethod');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');

  const handlePayPalClick = () => {
    const itemName = `Zimbabwe Maids Centre - 30-Day Access Fee`;
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${paymentDetails.paypal.email}&currency_code=USD&amount=${ACCESS_FEE}&item_name=${encodeURIComponent(itemName)}`;
    window.open(paypalUrl, '_blank', 'noopener,noreferrer');
    // Bypass code entry for PayPal
    onSubmit('PAYPAL_DIRECT');
  };

  const handleVerify = () => {
    if (!confirmationCode.trim()) {
      setError('Please enter the confirmation code.');
      return;
    }
    setError('');
    onSubmit(confirmationCode.trim());
  };

  const renderContent = () => {
    switch(step) {
      case 'selectMethod':
        return (
          <>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">Unlock Full Access</h3>
            <p className="text-slate-600 mb-4">
              To hire employees or view more profiles, please complete the access payment.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mb-6">
              <p className="text-slate-700">One-time access fee:</p>
              <p className="text-3xl font-bold text-emerald-600">${ACCESS_FEE} USD</p>
              <p className="text-xs text-slate-600 mt-2">Grants 30 days of hiring access &amp; unlimited profile views.</p>
            </div>
            
            <h4 className="text-lg font-semibold mb-4">Select Payment Method</h4>
            <div className="space-y-4">
               <button
                  onClick={handlePayPalClick}
                  className="w-full p-4 border-2 rounded-lg font-bold bg-[#00457C] text-white border-[#00457C] hover:bg-[#003057] flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="fab fa-paypal text-xl"></i> Pay with PayPal
                </button>
                <button
                  onClick={() => setStep('otherMethodsInfo')}
                  className="w-full p-4 border-2 rounded-lg font-semibold border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Other Methods (Ecocash, Mukuru, etc.)
                </button>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={onClose}
                className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        );
      case 'otherMethodsInfo':
        return (
          <>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">Other Payment Methods</h3>
            <p className="text-slate-600 mb-4">Please follow the instructions on our Help page to pay.</p>
            <div className="bg-slate-100 p-4 rounded-lg text-left space-y-3">
               <p className="text-sm">For <strong>Ecocash, Mukuru, WorldRemit, or Cash payments</strong>, please find detailed instructions in our <strong>Help & Support</strong> section.</p>
               <p className="text-sm">After you have paid, send proof of payment to our WhatsApp to get your confirmation code.</p>
            </div>
            <p className="text-sm text-slate-500 mt-4">{paymentDetails.confirmationInstructions}</p>
            <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setStep('selectMethod')}
                  className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('enterCode')}
                  className="py-2 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors"
                >
                  I have a code
                </button>
            </div>
          </>
        );
      case 'enterCode':
        return (
          <>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">Confirm Your Payment</h3>
            <p className="text-slate-600 mb-4">Enter the code you received to finalize your transaction.</p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6 text-left">
              <p className="text-sm text-blue-800">{paymentDetails.confirmationInstructions}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="confirmationCode" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirmation Code
                </label>
                <input
                  id="confirmationCode"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-md text-center tracking-widest font-bold"
                  placeholder="Enter code here"
                  required
                />
              </div>
               {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-center gap-4 pt-2">
                 <button
                    onClick={onClose}
                    className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerify}
                    className="py-2 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors"
                  >
                    Verify & Complete
                  </button>
              </div>
            </div>
          </>
        );
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default AccessPaymentModal;