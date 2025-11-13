import React, { useState, useRef, useEffect } from 'react';
import { SupportTicket, TicketStatus, TicketCategory } from '../types';

interface TicketDetailViewProps {
  ticket: SupportTicket;
  onBack: () => void;
  onReply: (ticketId: number, replyText: string) => void;
}

const TicketDetailView: React.FC<TicketDetailViewProps> = ({ ticket, onBack, onReply }) => {
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getStatusChipStyle = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Open: return 'bg-emerald-100 text-emerald-800';
      case TicketStatus.InProgress: return 'bg-blue-100 text-blue-800';
      case TicketStatus.Closed: return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(ticket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto flex flex-col h-[80vh]">
      <div className="border-b-2 border-slate-200 pb-4 mb-4">
        <button onClick={onBack} className="mb-4 text-emerald-600 hover:text-emerald-800 font-semibold">
          <i className="fas fa-arrow-left mr-2"></i> Back to Tickets
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-500">{ticket.category}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{ticket.subject}</h2>
            <p className="text-sm text-slate-500 mt-1">Ticket #{ticket.id} &bull; Created: {ticket.createdAt}</p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusChipStyle(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4 rounded-lg">
        {ticket.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.author === 'User' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-4 rounded-lg shadow-sm ${msg.author === 'User' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-800 border'}`}>
              <p>{msg.text}</p>
              <p className={`text-xs mt-2 ${msg.author === 'User' ? 'text-emerald-100' : 'text-slate-500'} text-right`}>
                {msg.author} &bull; {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {ticket.status !== TicketStatus.Closed && (
        <div className="pt-4 mt-4 border-t border-slate-200">
          <form onSubmit={handleReplySubmit}>
            <label htmlFor="reply" className="block text-sm font-medium text-slate-700 mb-2">
              Add a Reply
            </label>
            <textarea
              id="reply"
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your message here..."
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              required
            ></textarea>
            <div className="text-right mt-3">
              <button
                type="submit"
                className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-700"
              >
                Send Reply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TicketDetailView;