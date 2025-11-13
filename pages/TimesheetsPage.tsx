import React, { useState } from 'react';
import { mockTimesheets } from '../constants';
import { Job, Timesheet, TimesheetStatus } from '../types';

interface TimesheetsPageProps {
    completedJobs: Job[];
}

const TimesheetsPage: React.FC<TimesheetsPageProps> = ({ completedJobs }) => {
    const [timesheets, setTimesheets] = useState<Timesheet[]>(mockTimesheets);
    const [showForm, setShowForm] = useState(false);
    
    // Filter jobs that are hourly
    const hourlyJobs = completedJobs.filter(job => job.hourlyRate);

    const getStatusChipStyle = (status: TimesheetStatus) => {
        switch (status) {
            case TimesheetStatus.Pending: return 'bg-yellow-100 text-yellow-800';
            case TimesheetStatus.Approved: return 'bg-blue-100 text-blue-800';
            case TimesheetStatus.Paid: return 'bg-emerald-100 text-emerald-800';
            case TimesheetStatus.Rejected: return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, this would submit to a backend.
        // For demo purposes, we'll just log it and add it to the list.
        const formData = new FormData(e.currentTarget);
        const selectedJob = hourlyJobs.find(j => j.id === Number(formData.get('jobId')));

        if (!selectedJob) {
            alert("Please select a valid job.");
            return;
        }

        const newTimesheet: Timesheet = {
            id: Date.now(),
            jobId: selectedJob.id,
            employeeId: 1, // Mock current employee ID
            employeeName: 'Rutendo Moyo', // Mock current employee name
            hoursWorked: Number(formData.get('hoursWorked')),
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            totalAmount: Number(formData.get('hoursWorked')) * selectedJob.hourlyRate!,
            currency: selectedJob.currency,
            status: TimesheetStatus.Pending,
        };
        
        setTimesheets(prev => [newTimesheet, ...prev]);
        setShowForm(false);
        alert("Timesheet submitted successfully!");
    }

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">My Timesheets</h2>
                    <p className="text-slate-500 mt-1">Submit hours and track your payments for hourly jobs.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                    <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
                    {showForm ? 'Cancel' : 'New Timesheet'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                     <h3 className="text-xl font-bold mb-4">Submit New Timesheet</h3>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                             <label htmlFor="jobId" className="block text-sm font-medium text-slate-700 mb-1">Select Job</label>
                             <select name="jobId" id="jobId" required className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                <option value="">-- Choose an hourly job --</option>
                                {hourlyJobs.map(job => <option key={job.id} value={job.id}>{job.title} - {job.clientName}</option>)}
                             </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                <input type="date" name="startDate" id="startDate" required className="w-full p-2 border border-slate-300 rounded-md"/>
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                <input type="date" name="endDate" id="endDate" required className="w-full p-2 border border-slate-300 rounded-md"/>
                            </div>
                             <div>
                                <label htmlFor="hoursWorked" className="block text-sm font-medium text-slate-700 mb-1">Hours Worked</label>
                                <input type="number" name="hoursWorked" id="hoursWorked" required min="1" className="w-full p-2 border border-slate-300 rounded-md"/>
                            </div>
                        </div>
                        <div className="text-right">
                            <button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors">Submit</button>
                        </div>
                     </form>
                </div>
            )}

            <div className="space-y-6">
                {timesheets.length > 0 ? (
                    timesheets.map(ts => (
                        <div key={ts.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{hourlyJobs.find(j=>j.id === ts.jobId)?.title || 'Job not found'}</h3>
                                    <p className="text-slate-500 mt-1">Period: {ts.startDate} to {ts.endDate}</p>
                                    <p className="font-semibold mt-2">{ts.hoursWorked} hours</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-left md:text-right">
                                    <p className="text-2xl font-bold text-emerald-600">{ts.totalAmount.toLocaleString()} <span className="text-base font-normal">{ts.currency}</span></p>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full mt-2 inline-block ${getStatusChipStyle(ts.status)}`}>
                                        {ts.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <i className="far fa-file-alt text-5xl text-slate-300 mb-4"></i>
                        <h3 className="text-xl font-bold text-slate-700">No Timesheets Submitted</h3>
                        <p className="text-slate-500 mt-2">Your submitted timesheets for hourly jobs will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimesheetsPage;
