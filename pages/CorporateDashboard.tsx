import React from 'react';
import { mockJobs, mockCorporateClients, mockEmployees } from '../constants';
import { Currency } from '../types';

// Mock data for this dashboard
const currentCorporateClient = mockCorporateClients[0];
const corporateJobs = mockJobs.filter(job => job.clientName === currentCorporateClient.companyName);
const corporateHires = mockEmployees.slice(0, 2); // Mock hires

const CorporateDashboard: React.FC = () => {
  
  const getCurrencySymbol = (currency: Currency) => {
    switch (currency) {
      case Currency.USD: return '$';
      case Currency.ZAR: return 'R';
      case Currency.RTGS: return 'Z$';
      default: return '$';
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {currentCorporateClient.companyName}</h1>
        <p className="text-slate-600 mt-1">Here's an overview of your corporate account.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <i className="fas fa-briefcase text-2xl text-emerald-500 mb-2"></i>
          <p className="text-slate-500">Active Job Postings</p>
          <p className="text-3xl font-bold">{corporateJobs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <i className="fas fa-users text-2xl text-blue-500 mb-2"></i>
          <p className="text-slate-500">Total Hires</p>
          <p className="text-3xl font-bold">{corporateHires.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <i className="fas fa-map-marker-alt text-2xl text-yellow-500 mb-2"></i>
          <p className="text-slate-500">Managed Locations</p>
          <p className="text-3xl font-bold">{currentCorporateClient.locations.length}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Manage Your Business Needs</h2>
            <button className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                <i className="fas fa-plus mr-2"></i> Post a New Job
            </button>
        </div>
        
        {/* Hires Section */}
        <div>
            <h3 className="text-xl font-semibold mb-3 border-b pb-2">Your Current Hires</h3>
            <div className="space-y-4">
                {corporateHires.map(hire => (
                    <div key={hire.id} className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                            <img src={hire.profilePictureUrl} alt={hire.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-bold">{hire.name}</p>
                                <p className="text-sm text-slate-600">{hire.role} at Harare CBD Branch</p>
                            </div>
                        </div>
                        <button className="text-emerald-600 font-semibold text-sm">View Profile</button>
                    </div>
                ))}
            </div>
        </div>

        {/* Jobs Section */}
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3 border-b pb-2">Your Active Job Postings</h3>
             <div className="space-y-4">
                {corporateJobs.map(job => (
                    <div key={job.id} className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                             <div>
                                <h4 className="font-bold text-slate-800">{job.title}</h4>
                                <div className="flex flex-wrap items-center text-slate-500 mt-1 text-sm gap-x-4">
                                    <span><i className="fas fa-map-marker-alt mr-1"></i>{job.location}</span>
                                    <span><i className="fas fa-money-bill-wave mr-1"></i>{getCurrencySymbol(job.currency)}{job.salary.toLocaleString()}</span>
                                </div>
                             </div>
                             <button className="text-emerald-600 font-semibold text-sm">View Applicants</button>
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateDashboard;
