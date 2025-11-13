import React, { useState } from 'react';
import { Transaction } from '../types';

interface RefundRequestModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSubmit: (details: { reason: string; comments: string }) => void;
}

const RefundRequestModal: React.FC<RefundRequestModalProps> = ({ transaction, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a reason for the refund request.');
      return;
    }
    if (!comments.trim()) {
      setError('Please provide details about your request.');
      return;
    }
    setError('');
    onSubmit({ reason, comments });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-slate-800">Request a Refund</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <p className="text-slate-600 mb-6">
          You are requesting a refund for the transaction: <br />
          <strong>{transaction.description}</strong> for <strong>${transaction.amount.toLocaleString()} {transaction.currency}</strong>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
              Reason for Request
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="">-- Select a Reason --</option>
              <option value="No Show">Employee did not show up</option>
              <option value="Poor Performance">Poor performance</option>
              <option value="Other">Other (please specify)</option>
            </select>
          </div>
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-slate-700 mb-1">
              Details
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Please provide a detailed explanation for your request. This will be sent to the admin team for review."
              required
            ></textarea>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundRequestModal;