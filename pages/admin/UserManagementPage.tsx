import React, { useState } from 'react';
import { mockEmployees, mockClients } from '../../constants';
import { EmployeeProfile, ClientProfile, Document } from '../../types';
import DocumentViewerModal from '../../components/DocumentViewerModal';

const AdminUserManagementPage: React.FC = () => {
    const [employees, setEmployees] = useState<EmployeeProfile[]>(mockEmployees);
    const [clients, setClients] = useState<ClientProfile[]>(mockClients);
    const [verifyingEmployee, setVerifyingEmployee] = useState<EmployeeProfile | null>(null);

    const handleApproveEmployee = (employeeId: number) => {
        setEmployees(emps => emps.map(emp => emp.id === employeeId ? { ...emp, verified: true } : emp));
        // In real app, API call would be made.
    };
    
    const handleSuspendUser = (userId: number, userType: 'employee' | 'client') => {
        alert(`User ${userId} (${userType}) has been suspended. (Demo)`);
        // In real app, API call to change user status.
    };

    const handleDocumentsUpdate = (employeeId: number, updatedDocuments: Document[]) => {
        setEmployees(emps => emps.map(emp => {
            if (emp.id === employeeId) {
                const updatedProfile = { ...emp, documents: updatedDocuments };
                
                // Automatically update top-level verification flags
                const policeClearance = updatedDocuments.find(d => d.type === 'Police Clearance');
                if (policeClearance) {
                    updatedProfile.policeClearanceVerified = policeClearance.status === 'Approved';
                }
                const medicalCert = updatedDocuments.find(d => d.type === 'Medical Certificate');
                if (medicalCert) {
                    updatedProfile.medicalClearance = medicalCert.status === 'Approved';
                }

                return updatedProfile;
            }
            return emp;
        }));
    };
    
    const hasPendingDocs = (employee: EmployeeProfile) => {
        return employee.documents.some(doc => doc.status === 'Pending');
    };

    return (
        <>
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="p-3 font-semibold">Name</th>
                                <th className="p-3 font-semibold">Role</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id} className="border-b">
                                    <td className="p-3 font-medium">{emp.name}</td>
                                    <td className="p-3">{emp.role}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${emp.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {emp.verified ? 'Verified' : 'Pending Approval'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center space-x-2">
                                        {hasPendingDocs(emp) && !emp.verified && (
                                            <button onClick={() => setVerifyingEmployee(emp)} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">Verify</button>
                                        )}
                                        {!emp.verified && (
                                            <button onClick={() => handleApproveEmployee(emp.id)} className="text-sm bg-emerald-500 text-white px-3 py-1 rounded-md hover:bg-emerald-600">Approve Profile</button>
                                        )}
                                        <button onClick={() => handleSuspendUser(emp.id, 'employee')} className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Suspend</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Client Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="p-3 font-semibold">Name</th>
                                <th className="p-3 font-semibold">Location</th>
                                <th className="p-3 font-semibold">Subscription</th>
                                <th className="p-3 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id} className="border-b">
                                    <td className="p-3 font-medium">{client.name}</td>
                                    <td className="p-3">{client.location}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${client.subscription === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}`}>
                                            {client.subscription}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleSuspendUser(client.id, 'client')} className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Suspend</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {verifyingEmployee && (
            <DocumentViewerModal 
                employee={verifyingEmployee}
                onClose={() => setVerifyingEmployee(null)}
                onUpdate={handleDocumentsUpdate}
            />
        )}
        </>
    );
};

export default AdminUserManagementPage;