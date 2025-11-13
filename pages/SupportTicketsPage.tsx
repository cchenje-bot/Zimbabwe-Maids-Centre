import React from 'react';
import { SupportTicket, TicketStatus } from '../types';

interface SupportTicketsPageProps {
  tickets: SupportTicket[];
  onViewTicket: (ticket: SupportTicket) => void;
  onCreateTicket: () => void;
}

const SupportTicketsPage: React.FC<SupportTicketsPageProps> = ({ tickets, onViewTicket, onCreateTicket }) => {

  const getStatusChipStyle = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Open:
        return 'bg-emerald-100 text-emerald-800';
      case TicketStatus.InProgress:
        return 'bg-blue-100 text-blue-800';
      case TicketStatus.Closed:
        return 'bg-slate-200 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Support Tickets</h2>
          <p className="text-slate-500 mt-1">Log and track your support requests.</p>
        </div>
        <button
          onClick={onCreateTicket}
          className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i> Create New Ticket
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Ticket ID</th>
                <th className="p-4 font-semibold text-slate-600">Subject</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
                <th className="p-4 font-semibold text-slate-600">Last Updated</th>
                <th className="p-4 font-semibold text-slate-600"></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-slate-100">
                  <td className="p-4 font-mono text-slate-600">#{ticket.id}</td>
                  <td className="p-4 font-medium text-slate-800">{ticket.subject}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusChipStyle(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{ticket.lastUpdated}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onViewTicket(ticket)}
                      className="text-sm text-emerald-600 font-semibold hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tickets.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-life-ring text-5xl text-slate-300 mb-4"></i>
            <h3 className="text-xl font-bold text-slate-700">No Tickets Found</h3>
            <p className="text-slate-500 mt-2">Click "Create New Ticket" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTicketsPage;