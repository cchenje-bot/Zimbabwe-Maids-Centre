import React, { useState } from 'react';
import { SupportTicket, TicketStatus, TicketPriority, AdminUser, TicketMessage } from '../../types';
import { mockAdmins, mockClients, mockEmployees } from '../../constants';

interface AdminTicketDetailViewProps {
  ticket: SupportTicket;
  onBack: () => void;
  onUpdateTicket: (updatedTicket: SupportTicket) => void;
}

const AdminTicketDetailView: React.FC<AdminTicketDetailViewProps> = ({ ticket, onBack, onUpdateTicket }) => {
    const [replyText, setReplyText] = useState('');
    
    const user = [...mockClients, ...mockEmployees].find(u => u.id === ticket.userId);

    const cannedResponses = [
        "Thank you for contacting support. We are looking into your issue and will get back to you shortly.",
        "To better assist you, could you please provide more details or a screenshot of the issue?",
        "This issue has been escalated to our technical team. We will update you as soon as we have more information."
    ];

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newMessage: TicketMessage = {
            id: Date.now(),
            author: 'Admin',
            text: replyText,
            timestamp: new Date().toLocaleString()
        };
        
        const updatedTicket = {
            ...ticket,
            messages: [...ticket.messages, newMessage],
            status: TicketStatus.InProgress,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        onUpdateTicket(updatedTicket);
        setReplyText('');
    };
    
    const handleUpdate = (field: keyof SupportTicket, value: any) => {
        const updatedTicket = { ...ticket, [field]: value, lastUpdated: new Date().toISOString().split('T')[0] };
        onUpdateTicket(updatedTicket);
    };

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-emerald-600 hover:text-emerald-800 font-semibold">
                <i className="fas fa-arrow-left mr-2"></i> Back to All Tickets
            </button>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold">{ticket.subject}</h3>
                <p className="text-slate-500">From: {user?.name || 'Unknown User'} (ID: {ticket.userId})</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 border-y py-4">
                    <div>
                        <label className="text-sm font-semibold">Status</label>
                        <select 
                            value={ticket.status}
                            onChange={(e) => handleUpdate('status', e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Priority</label>
                        <select 
                            value={ticket.priority}
                            onChange={(e) => handleUpdate('priority', e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Assigned Admin</label>
                         <select 
                            value={ticket.assignedAdminId || ''}
                            onChange={(e) => handleUpdate('assignedAdminId', Number(e.target.value))}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Unassigned</option>
                            {mockAdmins.map(admin => <option key={admin.id} value={admin.id}>{admin.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto bg-slate-50 p-4 rounded-lg mb-4">
                    {ticket.messages.map(msg => (
                         <div key={msg.id} className={`flex ${msg.author === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl p-3 rounded-lg shadow-sm ${msg.author === 'Admin' ? 'bg-emerald-100' : 'bg-white border'}`}>
                                <p className="text-slate-800">{msg.text}</p>
                                <p className="text-xs text-slate-500 mt-2 text-right">{msg.author} &bull; {msg.timestamp}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleReply}>
                    <h4 className="font-bold mb-2">Reply to User</h4>
                    <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={5}
                        className="w-full p-2 border rounded-md"
                        placeholder="Type your response..."
                    />
                    <div className="my-3">
                        <h5 className="text-sm font-semibold mb-2">Canned Responses</h5>
                        <div className="flex flex-wrap gap-2">
                            {cannedResponses.map((res, i) => (
                                <button key={i} type="button" onClick={() => setReplyText(res)} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-full">
                                    {res.substring(0, 30)}...
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700">Send Reply</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface AdminSupportTicketsPageProps {
  initialTickets: SupportTicket[];
}

const AdminSupportTicketsPage: React.FC<{tickets: SupportTicket[]}> = ({ tickets: initialTickets }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const handleUpdateTicket = (updatedTicket: SupportTicket) => {
        setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
    };

    const getUserName = (userId: number) => {
        const user = [...mockClients, ...mockEmployees].find(u => u.id === userId);
        return user?.name || `User ID: ${userId}`;
    };

    const getAdminName = (adminId?: number) => {
        if (!adminId) return 'Unassigned';
        return mockAdmins.find(a => a.id === adminId)?.name || 'Unknown Admin';
    }
    
    const getPriorityChipStyle = (priority: TicketPriority) => {
      switch (priority) {
        case TicketPriority.Urgent: return 'bg-red-100 text-red-800';
        case TicketPriority.High: return 'bg-orange-100 text-orange-800';
        case TicketPriority.Medium: return 'bg-yellow-100 text-yellow-800';
        case TicketPriority.Low: return 'bg-blue-100 text-blue-800';
        default: return 'bg-slate-100 text-slate-800';
      }
    };

    if (selectedTicket) {
        return <AdminTicketDetailView ticket={selectedTicket} onBack={() => setSelectedTicket(null)} onUpdateTicket={handleUpdateTicket} />;
    }

    return (
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">All Support Tickets</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="p-3 font-semibold">Subject</th>
                            <th className="p-3 font-semibold">User</th>
                            <th className="p-3 font-semibold">Priority</th>
                            <th className="p-3 font-semibold">Status</th>
                            <th className="p-3 font-semibold">Assigned To</th>
                            <th className="p-3 font-semibold">Last Updated</th>
                            <th className="p-3 font-semibold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id} className="border-b">
                                <td className="p-3 font-medium">{ticket.subject}</td>
                                <td className="p-3 text-sm">{getUserName(ticket.userId)}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getPriorityChipStyle(ticket.priority)}`}>{ticket.priority}</span></td>
                                <td className="p-3">{ticket.status}</td>
                                <td className="p-3">{getAdminName(ticket.assignedAdminId)}</td>
                                <td className="p-3 text-sm">{ticket.lastUpdated}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => setSelectedTicket(ticket)} className="text-sm bg-emerald-600 text-white px-3 py-1 rounded-md hover:bg-emerald-700">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSupportTicketsPage;