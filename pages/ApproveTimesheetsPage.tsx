import React, { useState } from 'react';
import { mockTimesheets } from '../constants';
import { Timesheet, TimesheetStatus, Transaction } from '../types';

interface ApproveTimesheetsPageProps {
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const ApproveTimesheetsPage: React.FC<ApproveTimesheetsPageProps> = ({ setTransactions }) => {
    const [timesheets, setTimesheets] = useState<Timesheet[]>(mockTimesheets);

    const handleApprove = (timesheetId: number) => {
        const timesheet = timesheets.find(ts => ts.id === timesheetId);
        if (!timesheet) return;

        // 1. Update timesheet status to Paid
        setTimesheets(currentTimesheets =>
            currentTimesheets.map(ts =>
                ts.id === timesheetId ? { ...ts, status: TimesheetStatus.Paid } : ts
            )
        );

        // 2. Create a new transaction record
        const newTransaction: Transaction = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            description: `Timesheet payment for ${timesheet.employeeName}`,
            amount: timesheet.totalAmount,
            currency: timesheet.currency,
            status: 'Completed',
            type: 'Timesheet'
        };

        // 3. Add transaction to the main list in ClientDashboard
        setTransactions(prev => [newTransaction, ...prev]);
        
        // 4. Show confirmation
        alert(`Payment of ${timesheet.totalAmount} ${timesheet.currency} approved for ${timesheet.employeeName}.`);
    };

    const handleReject = (timesheetId: number) => {
        setTimesheets(currentTimesheets =>
            currentTimesheets.map(ts =>
                ts.id === timesheetId ? { ...ts, status: TimesheetStatus.Rejected } : ts
            )
        );
         alert('Timesheet has been marked as rejected.');
    };

    const getStatusChipStyle = (status: TimesheetStatus) => {
        switch (status) {
            case TimesheetStatus.Pending: return 'bg-yellow-100 text-yellow-800';
            case TimesheetStatus.Approved: return 'bg-blue-100 text-blue-800';
            case TimesheetStatus.Paid: return 'bg-emerald-100 text-emerald-800';
            case TimesheetStatus.Rejected: return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold">Approve Timesheets</h2>
                <p className="text-slate-500 mt-1">Review and process payments for submitted timesheets.</p>
            </div>

            <div className="space-y-6">
                {timesheets.length > 0 ? (
                    timesheets.map(ts => (
                        <div key={ts.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{ts.employeeName}</h3>
                                    <p className="text-slate-500 mt-1">Period: {ts.startDate} to {ts.endDate}</p>
                                    <p className="font-semibold mt-2">{ts.hoursWorked} hours worked</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-left md:text-right">
                                    <p className="text-2xl font-bold text-emerald-600">{ts.totalAmount.toLocaleString()} <span className="text-base font-normal">{ts.currency}</span></p>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full mt-2 inline-block ${getStatusChipStyle(ts.status)}`}>
                                        {ts.status}
                                    </span>
                                </div>
                            </div>
                            {ts.status === TimesheetStatus.Pending && (
                                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end gap-3">
                                    <button 
                                        onClick={() => handleReject(ts.id)}
                                        className="bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg hover:bg-red-200 transition-colors text-sm">
                                        Reject
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(ts.id)}
                                        className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                                        <i className="fas fa-check-circle mr-2"></i> Approve & Pay
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <i className="far fa-clock text-5xl text-slate-300 mb-4"></i>
                        <h3 className="text-xl font-bold text-slate-700">No Pending Timesheets</h3>
                        <p className="text-slate-500 mt-2">Submitted timesheets from your employees will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApproveTimesheetsPage;