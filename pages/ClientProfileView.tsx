import React from 'react';
import { ClientProfile } from '../types';
import { mockJobs } from '../constants';

interface ClientProfileViewProps {
  client: ClientProfile;
  onBack: () => void;
}

const ClientProfileView: React.FC<ClientProfileViewProps> = ({ client, onBack }) => {
  const clientJobs = mockJobs.filter(job => job.clientId === client.id);

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 text-emerald-600 hover:text-emerald-800 font-semibold">
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 text-center">
          <img src={client.profilePictureUrl} alt={client.name} className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-emerald-200" />
          <h2 className="text-3xl font-bold mt-4">{client.name}</h2>
          <div className="flex items-center justify-center text-slate-500 mt-2">
            <i className="fas fa-map-marker-alt mr-2"></i> {client.location}
          </div>
          <p className="text-sm text-slate-400 mt-2">Member since {client.memberSince}</p>
        </div>

        <div className="md:w-2/3">
          <div className="mb-6">
            <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">About Us</h3>
            <p className="text-slate-600 whitespace-pre-wrap">{client.bio}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Household Details</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-lg">
                <i className="fas fa-user-friends text-2xl text-emerald-600 mb-2"></i>
                <p className="font-bold">{client.householdDetails.adults} Adults</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <i className="fas fa-child text-2xl text-emerald-600 mb-2"></i>
                <p className="font-bold">{client.householdDetails.children} Children</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <i className="fas fa-paw text-2xl text-emerald-600 mb-2"></i>
                <p className="font-bold">{client.householdDetails.pets || 'No Pets'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Active Job Postings</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {clientJobs.length > 0 ? (
                clientJobs.map(job => (
                  <div key={job.id} className="bg-slate-50 p-3 rounded-lg">
                    <p className="font-bold text-slate-800">{job.title}</p>
                    <p className="text-sm text-slate-500">{job.location}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No active job postings.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileView;