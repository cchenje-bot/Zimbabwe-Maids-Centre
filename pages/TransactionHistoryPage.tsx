import React from 'react';
import { Transaction, Currency } from '../types';

interface TransactionHistoryPageProps {
  transactions: Transaction[];
  onRefundRequest: (transaction: Transaction) => void;
}

const TransactionHistoryPage: React.FC<TransactionHistoryPageProps> = ({ transactions, onRefundRequest }) => {
  const getStatusChipStyle = (status: 'Completed' | 'Pending' | 'Failed') => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  // FIX: Handle 'Access' transaction type
  const getTypeChipStyle = (type: 'Hire' | 'Timesheet' | 'Access') => {
    switch(type) {
      case 'Hire':
        return 'bg-blue-100 text-blue-800';
      case 'Timesheet':
        return 'bg-purple-100 text-purple-800';
      case 'Access':
        return 'bg-green-100 text-green-800';
    }
  };

  const getCurrencySymbol = (currency: Currency) => {
    switch (currency) {
      case Currency.USD: return '$';
      case Currency.ZAR: return 'R';
      case Currency.RTGS: return 'Z$';
      default: return '$';
    }
  }

  const renderRefundAction = (tx: Transaction) => {
    if (tx.type !== 'Hire' || tx.status !== 'Completed') {
        return null; // No action for non-hire or non-completed transactions
    }

    if (tx.refundStatus === 'Requested') {
        return <span className="text-sm font-semibold text-yellow-600">Refund Requested</span>;
    }
    
    if (tx.refundStatus === 'Approved') {
        return <span className="text-sm font-semibold text-emerald-600">Refund Approved</span>;
    }
    
    if (tx.refundStatus === 'Rejected') {
        return <span className="text-sm font-semibold text-red-600">Refund Rejected</span>;
    }

    return (
        <button 
            onClick={() => onRefundRequest(tx)}
            className="text-sm bg-slate-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-slate-700 transition-colors"
        >
            Request Refund
        </button>
    );
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <p className="text-slate-500 mt-1">A record of all your payments.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Date</th>
                <th className="p-4 font-semibold text-slate-600">Description</th>
                <th className="p-4 font-semibold text-slate-600">Type</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Amount</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Status</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: Transaction) => (
                <tr key={tx.id} className="border-b border-slate-100">
                  <td className="p-4 text-slate-600">{tx.date}</td>
                  <td className="p-4 font-medium text-slate-800">{tx.description}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getTypeChipStyle(tx.type)}`}>
                        {tx.type}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono">{getCurrencySymbol(tx.currency)}{tx.amount.toLocaleString()} <span className="text-xs text-slate-500">{tx.currency}</span></td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusChipStyle(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {renderRefundAction(tx)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-receipt text-5xl text-slate-300 mb-4"></i>
            <h3 className="text-xl font-bold text-slate-700">No Transactions Found</h3>
            <p className="text-slate-500 mt-2">Your payment history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;