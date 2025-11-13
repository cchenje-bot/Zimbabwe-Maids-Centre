import React, { useState } from 'react';
import { Dispute, DisputeStatus } from '../../types';
import { mockClients, mockEmployees } from '../../constants';

interface DisputeResolutionPageProps {
  disputes: Dispute[];
}

const AdminDisputeResolutionPage: React.FC<DisputeResolutionPageProps> = ({ disputes: initialDisputes }) => {
    const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);
    const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

    const handleStatusChange = (disputeId: number, status: DisputeStatus) => {
        setDisputes(prev => prev.map(d => d.id === disputeId ? { ...d, status } : d));
        if (selectedDispute?.id === disputeId) {
            setSelectedDispute(prev => prev ? { ...prev, status } : null);
        }
    };

    const getStatusChipStyle = (status: DisputeStatus) => {
        switch (status) {
            case DisputeStatus.Open: return 'bg-red-100 text-red-800';
            case DisputeStatus.UnderReview: return 'bg-yellow-100 text-yellow-800';
            case DisputeStatus.Resolved: return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getUserName = (id: number, type: 'client' | 'employee') => {
        const userList = type === 'client' ? mockClients : mockEmployees;
        return userList.find(u => u.id === id)?.name || 'Unknown';
    };

    if (selectedDispute) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <button onClick={() => setSelectedDispute(null)} className="mb-4 text-emerald-600 hover:text-emerald-800 font-semibold">
                    <i className="fas fa-arrow-left mr-2"></i> Back to Disputes
                </button>
                <h3 className="text-2xl font-bold">Dispute #{selectedDispute.id} - {selectedDispute.reason}</h3>
                <div className="my-4 border-y py-4 flex items-center justify-between">
                    <p>Status: <span className={`font-bold px-2 py-1 rounded-full text-sm ${getStatusChipStyle(selectedDispute.status)}`}>{selectedDispute.status}</span></p>
                    {selectedDispute.status !== DisputeStatus.Resolved && (
                         <button onClick={() => handleStatusChange(selectedDispute.id, DisputeStatus.Resolved)} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-sm">Mark as Resolved</button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-bold border-b pb-2 mb-2">Client's Statement ({getUserName(selectedDispute.clientId, 'client')})</h4>
                        <p className="text-slate-700 italic">"{selectedDispute.clientStatement}"</p>
                    </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-bold border-b pb-2 mb-2">Employee's Statement ({getUserName(selectedDispute.employeeId, 'employee')})</h4>
                        <p className="text-slate-700 italic">"{selectedDispute.employeeStatement}"</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Dispute Resolution Center</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="p-3 font-semibold">Dispute ID</th>
                            <th className="p-3 font-semibold">Involved Parties</th>
                            <th className="p-3 font-semibold">Reason</th>
                            <th className="p-3 font-semibold">Status</th>
                            <th className="p-3 font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {disputes.map(dispute => (
                            <tr key={dispute.id} className="border-b">
                                <td className="p-3 font-mono">#{dispute.id}</td>
                                <td className="p-3 text-sm">
                                    <strong>C:</strong> {getUserName(dispute.clientId, 'client')} <br/>
                                    <strong>E:</strong> {getUserName(dispute.employeeId, 'employee')}
                                </td>
                                <td className="p-3">{dispute.reason}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusChipStyle(dispute.status)}`}>{dispute.status}</span>
                                </td>
                                <td className="p-3 text-right">
                                    <button onClick={() => setSelectedDispute(dispute)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">Review Case</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDisputeResolutionPage;
