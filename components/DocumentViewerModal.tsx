import React, { useState } from 'react';
import { EmployeeProfile, Document } from '../types';

interface DocumentViewerModalProps {
  employee: EmployeeProfile;
  onClose: () => void;
  onUpdate: (employeeId: number, updatedDocuments: Document[]) => void;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ employee, onClose, onUpdate }) => {
    const [documents, setDocuments] = useState<Document[]>(employee.documents);

    const handleStatusChange = (docIndex: number, status: 'Approved' | 'Rejected') => {
        const updatedDocs = [...documents];
        updatedDocs[docIndex].status = status;
        setDocuments(updatedDocs);
    };
    
    const handleSaveChanges = () => {
        onUpdate(employee.id, documents);
        onClose();
    };

    const getStatusChipStyle = (status: 'Pending' | 'Approved' | 'Rejected') => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Approved': return 'bg-emerald-100 text-emerald-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">Verify Documents for {employee.name}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {documents.map((doc, index) => (
                        <div key={index} className="bg-slate-50 p-4 rounded-lg border">
                            <div className="flex flex-col sm:flex-row justify-between items-start">
                                <div>
                                    <h4 className="font-bold">{doc.type}</h4>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline">
                                        View Document <i className="fas fa-external-link-alt ml-1"></i>
                                    </a>
                                </div>
                                <div className="mt-3 sm:mt-0 flex items-center gap-3">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusChipStyle(doc.status)}`}>
                                        {doc.status}
                                    </span>
                                    {doc.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleStatusChange(index, 'Rejected')} className="text-red-500 hover:text-red-700" title="Reject"><i className="fas fa-times-circle"></i></button>
                                            <button onClick={() => handleStatusChange(index, 'Approved')} className="text-emerald-500 hover:text-emerald-700" title="Approve"><i className="fas fa-check-circle"></i></button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="py-2 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewerModal;