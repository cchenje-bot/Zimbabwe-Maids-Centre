import React, { useState } from 'react';
import AdminUserManagementPage from './admin/UserManagementPage';
import AdminJobManagementPage from './admin/JobManagementPage';
import AdminReportsPage from './admin/ReportsPage';
import { mockEmployees, mockJobs, mockClients, mockTransactions, mockSupportTickets, mockDisputes, mockReviews, mockAuditLogs } from '../constants';
import { Currency, Transaction } from '../types';
import BIDashboardPage from './admin/BIDashboardPage';
import AdminSupportTicketsPage from './admin/AdminSupportTicketsPage';
import AdminDisputeResolutionPage from './admin/DisputeResolutionPage';
import AdminBroadcastPage from './admin/BroadcastPage';
import AdminReviewModerationPage from './admin/ReviewModerationPage';
import AdminAuditLogsPage from './admin/AuditLogsPage';

type AdminView = 'dashboard' | 'users' | 'jobs' | 'reports' | 'biDashboard' | 'support' | 'disputes' | 'broadcast' | 'reviews' | 'auditLogs';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  // Activity Stats
  const pendingApprovals = mockEmployees.filter(e => !e.verified).length;
  const totalUsers = mockEmployees.length + mockClients.length;
  const totalJobs = mockJobs.length;
  
  // Financial Stats
  const placementsMade = mockTransactions.filter(tx => tx.type === 'Hire' && tx.status === 'Completed').length;

  const calculateTotal = (status: 'Completed' | 'Pending' | 'Failed') => {
    return mockTransactions
        .filter(tx => tx.status === status && tx.currency === Currency.USD)
        .reduce((sum, tx) => sum + tx.amount, 0);
  }

  const cashPaid = calculateTotal('Completed');
  const outstandingPayments = calculateTotal('Pending');
  const failedPayments = calculateTotal('Failed');


  const renderContent = () => {
    switch (currentView) {
      case 'users':
        return <AdminUserManagementPage />;
      case 'jobs':
        return <AdminJobManagementPage />;
      case 'reviews':
        return <AdminReviewModerationPage reviews={mockReviews} />;
      case 'auditLogs':
        return <AdminAuditLogsPage logs={mockAuditLogs} />;
      case 'reports':
        return <AdminReportsPage />;
      case 'biDashboard':
        return <BIDashboardPage />;
      case 'support':
        return <AdminSupportTicketsPage tickets={mockSupportTickets} />;
      case 'disputes':
        return <AdminDisputeResolutionPage disputes={mockDisputes} />;
      case 'broadcast':
        return <AdminBroadcastPage />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
            
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4 pb-2 border-b">User & Activity Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <i className="fas fa-users text-2xl text-blue-500 mb-2"></i>
                  <p className="text-slate-500">Total Users</p>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <i className="fas fa-briefcase text-2xl text-emerald-500 mb-2"></i>
                  <p className="text-slate-500">Total Jobs Posted</p>
                  <p className="text-3xl font-bold">{totalJobs}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <i className="fas fa-user-clock text-2xl text-yellow-500 mb-2"></i>
                  <p className="text-slate-500">Pending Approvals</p>
                  <p className="text-3xl font-bold">{pendingApprovals}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4 pb-2 border-b">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <i className="fas fa-handshake text-2xl text-green-500 mb-2"></i>
                    <p className="text-slate-500">Placements Made</p>
                    <p className="text-3xl font-bold">{placementsMade}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <i className="fas fa-cash-register text-2xl text-emerald-500 mb-2"></i>
                    <p className="text-slate-500">Cash Paid (USD)</p>
                    <p className="text-3xl font-bold">${cashPaid.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <i className="fas fa-file-invoice-dollar text-2xl text-orange-500 mb-2"></i>
                    <p className="text-slate-500">Outstanding Payments (USD)</p>
                    <p className="text-3xl font-bold">${outstandingPayments.toLocaleString()}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <i className="fas fa-exclamation-circle text-2xl text-red-500 mb-2"></i>
                    <p className="text-slate-500">Failed Payments (USD)</p>
                    <p className="text-3xl font-bold">${failedPayments.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <button onClick={() => setCurrentView('users')} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">Manage Users</button>
                    <button onClick={() => setCurrentView('jobs')} className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors">Manage Jobs</button>
                    <button onClick={() => setCurrentView('reports')} className="bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">View Reports</button>
                </div>
            </div>
          </div>
        );
    }
  };
  
  const NavButton = ({ view, icon, label }: { view: AdminView, icon: string, label: string }) => (
    <button
        onClick={() => setCurrentView(view)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
            currentView === view
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
        }`}
    >
        <i className={`fas ${icon} w-5 text-center`}></i>
        <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-1/4 lg:w-1/5">
        <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
           <NavButton view="dashboard" icon="fa-tachometer-alt" label="Dashboard" />
           <NavButton view="users" icon="fa-users-cog" label="User Management" />
           <NavButton view="jobs" icon="fa-briefcase" label="Job Management" />
           
           <div className="pt-2 mt-2 border-t">
            <h4 className="px-4 pt-2 pb-1 text-xs font-bold text-slate-400 uppercase">Moderation</h4>
             <NavButton view="reviews" icon="fa-star-half-alt" label="Review Moderation" />
             <NavButton view="auditLogs" icon="fa-history" label="Audit Logs" />
           </div>

           <div className="pt-2 mt-2 border-t">
            <h4 className="px-4 pt-2 pb-1 text-xs font-bold text-slate-400 uppercase">Support</h4>
             <NavButton view="support" icon="fa-life-ring" label="Support Tickets" />
             <NavButton view="disputes" icon="fa-gavel" label="Disputes" />
             <NavButton view="broadcast" icon="fa-bullhorn" label="Broadcast" />
           </div>

           <div className="pt-2 mt-2 border-t">
             <h4 className="px-4 pt-2 pb-1 text-xs font-bold text-slate-400 uppercase">Analytics</h4>
             <NavButton view="reports" icon="fa-chart-line" label="Reports" />
             <NavButton view="biDashboard" icon="fa-chart-pie" label="BI Dashboard" />
           </div>
        </div>
      </aside>
      <div className="md:w-3/4 lg:w-4/5">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;