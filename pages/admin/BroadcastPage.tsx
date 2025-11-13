import React, { useState } from 'react';

const AdminBroadcastPage: React.FC = () => {
    const [target, setTarget] = useState<'all' | 'clients' | 'employees'>('all');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            alert('Please fill in both the subject and the message.');
            return;
        }

        setIsSending(true);
        // Simulate API call
        setTimeout(() => {
            console.log({
                target,
                subject,
                message,
            });
            alert(`Broadcast sent successfully to ${target} users!`);
            setIsSending(false);
            setSubject('');
            setMessage('');
        }, 1000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-1">Broadcast Messaging</h2>
            <p className="text-slate-500 mb-6">Send important announcements to your users.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="target" className="block text-sm font-medium text-slate-700 mb-1">
                        Send To
                    </label>
                    <select
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value as any)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Users</option>
                        <option value="clients">Clients Only</option>
                        <option value="employees">Employees Only</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                        Subject
                    </label>
                    <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        placeholder="e.g., Important Platform Update"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                        Message
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={8}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                        placeholder="Compose your announcement here..."
                        required
                    ></textarea>
                </div>
                 <div className="text-right">
                    <button
                        type="submit"
                        disabled={isSending}
                        className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-400 flex items-center justify-center min-w-[150px]"
                    >
                        {isSending ? <><i className="fas fa-spinner fa-spin mr-2"></i> Sending...</> : <><i className="fas fa-paper-plane mr-2"></i> Send Broadcast</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminBroadcastPage;
