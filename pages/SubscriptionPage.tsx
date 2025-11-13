import React from 'react';
import { SubscriptionPlan } from '../types';

interface SubscriptionPageProps {
  currentPlan: SubscriptionPlan;
  onUpgrade: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ currentPlan, onUpgrade }) => {
  const isPremium = currentPlan === SubscriptionPlan.Premium;

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Our Subscription Plans</h2>
        <p className="text-slate-500 mt-2">Choose the plan that's right for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Plan */}
        <div className={`border-4 ${!isPremium ? 'border-emerald-500' : 'border-slate-300'} p-8 rounded-lg relative`}>
          {!isPremium && <span className="absolute top-0 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">CURRENT PLAN</span>}
          <h3 className="text-2xl font-bold text-slate-900">Basic</h3>
          <p className="text-3xl font-extrabold my-4">Free</p>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-center gap-3"><i className="fas fa-check-circle text-emerald-500"></i> Post up to 3 jobs a month</li>
            <li className="flex items-center gap-3"><i className="fas fa-check-circle text-emerald-500"></i> Browse standard profiles</li>
            <li className="flex items-center gap-3"><i className="fas fa-check-circle text-emerald-500"></i> Standard support</li>
            <li className="flex items-center gap-3 text-slate-400"><i className="fas fa-times-circle"></i> Access to Elite Workers</li>
            <li className="flex items-center gap-3 text-slate-400"><i className="fas fa-times-circle"></i> Advanced verification filters</li>
          </ul>
           <button 
                disabled={!isPremium}
                className="w-full mt-8 bg-slate-200 text-slate-500 font-bold py-3 rounded-lg cursor-not-allowed"
            >
                Your Current Plan
            </button>
        </div>

        {/* Premium Plan */}
        <div className={`border-4 ${isPremium ? 'border-emerald-500' : 'border-slate-300'} p-8 rounded-lg relative`}>
            {isPremium && <span className="absolute top-0 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">CURRENT PLAN</span>}
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-slate-900">Premium</h3>
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">BEST VALUE</span>
            </div>
          <p className="my-4">
            <span className="text-3xl font-extrabold">$19.99</span>
            <span className="text-slate-500"> / month</span>
          </p>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-center gap-3"><i className="fas fa-check-circle text-emerald-500"></i> Unlimited job posts</li>
            <li className="flex items-center gap-3"><i className="fas fa-check-circle text-emerald-500"></i> Unlimited profile browsing</li>
            <li className="flex items-center gap-3"><i className="fas fa-check-circle text-emerald-500"></i> Priority customer support</li>
            <li className="flex items-center gap-3 font-bold text-emerald-700"><i className="fas fa-gem text-purple-500"></i> Access to Elite Workers</li>
            <li className="flex items-center gap-3 font-bold text-emerald-700"><i className="fas fa-user-shield text-sky-500"></i> Filter by reference & medical checks</li>
          </ul>
           <button 
                onClick={onUpgrade}
                disabled={isPremium}
                className="w-full mt-8 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                {isPremium ? 'Your Current Plan' : 'Upgrade to Premium'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;