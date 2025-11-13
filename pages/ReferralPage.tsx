import React, { useState } from 'react';
import { mockEmployees, mockReferrals } from '../constants';
import { ReferralStatus } from '../types';

// For demonstration, we'll assume the logged-in employee is the first one.
const currentEmployee = mockEmployees[0];

interface ReferralPageProps {
  onBack: () => void;
}

const ReferralPage: React.FC<ReferralPageProps> = ({ onBack }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const referralLink = `https://zimbabwemaids.co.zw/signup?ref=${currentEmployee.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopyButtonText('Copied!');
    setTimeout(() => setCopyButtonText('Copy'), 2000);
  };

  const totalRewards = mockReferrals
    .filter(r => r.status === ReferralStatus.Completed)
    .reduce((sum, r) => sum + r.reward, 0);

  const getStatusChipStyle = (status: ReferralStatus) => {
    switch (status) {
      case ReferralStatus.Completed:
        return 'bg-emerald-100 text-emerald-800';
      case ReferralStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Referral Program</h2>
        <button onClick={onBack} className="text-emerald-600 hover:text-emerald-800 font-semibold">
          <i className="fas fa-times mr-2"></i> Close
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <i className="fas fa-users text-3xl text-emerald-600"></i>
            <div>
              <p className="text-slate-600">Total Referrals</p>
              <p className="text-2xl font-bold text-slate-800">{mockReferrals.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <i className="fas fa-gift text-3xl text-yellow-600"></i>
            <div>
              <p className="text-slate-600">Total Rewards Earned</p>
              <p className="text-2xl font-bold text-slate-800">${totalRewards.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3">Share Your Link</h3>
        <p className="text-slate-600 mb-4">Share this link with friends. When they sign up and complete their first job, you'll both earn a $5 credit!</p>
        <div className="flex">
          <input 
            type="text"
            readOnly
            value={referralLink}
            className="w-full p-3 border border-slate-300 rounded-l-md bg-slate-50 text-slate-700 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-r-md hover:bg-emerald-700 transition-colors w-28"
          >
            {copyButtonText}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">My Referrals</h3>
        <div className="space-y-4">
          {mockReferrals.length > 0 ? (
            mockReferrals.map(referral => (
              <div key={referral.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{referral.refereeName}</p>
                  <p className="text-sm text-slate-500">Referred on: {referral.date}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusChipStyle(referral.status)}`}>
                    {referral.status}
                  </span>
                  <p className="text-sm font-semibold text-slate-600 mt-1">Reward: ${referral.reward.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-user-plus text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-500">You haven't referred anyone yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
