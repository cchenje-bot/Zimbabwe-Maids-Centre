import React, { useState } from 'react';
import { mockJobs } from '../../constants';
import { Job, Currency } from '../../types';

const AdminJobManagementPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>(mockJobs);
    
    const handleRemoveJob = (jobId: number) => {
        if (window.confirm("Are you sure you want to remove this job posting?")) {
            setJobs(currentJobs => currentJobs.filter(job => job.id !== jobId));
            // In a real app, API call to delete the job.
        }
    };
    
    const getCurrencySymbol = (currency: Currency) => {
        switch (currency) {
          case Currency.USD: return '$';
          case Currency.ZAR: return 'R';
          case Currency.RTGS: return 'Z$';
          default: return '$';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Job Postings Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="p-3 font-semibold">Title</th>
                            <th className="p-3 font-semibold">Client</th>
                            <th className="p-3 font-semibold">Category</th>
                            <th className="p-3 font-semibold">Salary</th>
                            <th className="p-3 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id} className="border-b">
                                <td className="p-3 font-medium">{job.title}</td>
                                <td className="p-3">{job.clientName}</td>
                                <td className="p-3">{job.category}</td>
                                <td className="p-3">{getCurrencySymbol(job.currency)}{job.salary.toLocaleString()} {job.currency}</td>
                                <td className="p-3 text-center">
                                    <button onClick={() => alert(`Viewing details for job ${job.id}`)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mr-2">View</button>
                                    <button onClick={() => handleRemoveJob(job.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminJobManagementPage;
