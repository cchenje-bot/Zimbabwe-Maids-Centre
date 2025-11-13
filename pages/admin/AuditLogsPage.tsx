import React from 'react';
import { AuditLog } from '../../types';

interface AuditLogsPageProps {
  logs: AuditLog[];
}

const AdminAuditLogsPage: React.FC<AuditLogsPageProps> = ({ logs }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Activity & Audit Logs</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="p-3 font-semibold">Timestamp</th>
                            <th className="p-3 font-semibold">Admin</th>
                            <th className="p-3 font-semibold">Action</th>
                            <th className="p-3 font-semibold">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} className="border-b">
                                <td className="p-3 text-sm text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                                <td className="p-3 font-medium">{log.adminName}</td>
                                <td className="p-3">
                                    <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-2 py-1 rounded">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-3 text-sm text-slate-700">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAuditLogsPage;