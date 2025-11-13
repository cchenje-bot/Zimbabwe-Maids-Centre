import React from 'react';
import { Job, Currency } from '../types';

interface SavedJobsPageProps {
  savedJobs: Job[];
  onJobClick: (job: Job) => void;
}

const SavedJobsPage: React.FC<SavedJobsPageProps> = ({ savedJobs, onJobClick }) => {

  const getCurrencySymbol = (currency: Currency) => {
    switch (currency) {
      case Currency.USD: return '$';
      case Currency.ZAR: return 'R';
      case Currency.RTGS: return 'Z$';
      default: return '$';
    }
  }

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold">My Saved Jobs</h2>
        <p className="text-slate-500 mt-1">Jobs you've saved for later.</p>
      </div>

      <div className="space-y-6">
        {savedJobs.length > 0 ? (
          savedJobs.map(job => (
            <div key={job.id} onClick={() => onJobClick(job)} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start">
              <div>
                <span className="text-xs font-semibold uppercase text-emerald-600 bg-emerald-100 px-2 py-1 rounded">{job.category}</span>
                <h3 className="text-xl font-bold text-slate-800 mt-2">{job.title}</h3>
                <p className="text-slate-500 mt-1">Posted by {job.clientName}</p>
                <div className="flex flex-wrap items-center text-slate-500 my-2 text-sm gap-x-4 gap-y-1">
                    <span><i className="fas fa-map-marker-alt mr-2"></i>{job.location}</span>
                    <span><i className="fas fa-clock mr-2"></i>{job.duration}</span>
                    <span><i className="fas fa-money-bill-wave mr-1"></i>{getCurrencySymbol(job.currency)}{job.salary.toLocaleString()} <span className="text-xs">{job.currency}</span></span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-sm text-slate-400">Posted on {job.postedDate}</p>
                <button className="mt-2 bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <i className="far fa-bookmark text-5xl text-slate-300 mb-4"></i>
            <h3 className="text-xl font-bold text-slate-700">No Saved Jobs</h3>
            <p className="text-slate-500 mt-2">Click the 'Save Job' button on a job listing to add it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
