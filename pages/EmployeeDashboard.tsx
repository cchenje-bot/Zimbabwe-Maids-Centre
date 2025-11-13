import React, { useState } from 'react';
import { mockJobs, mockEmployees, mockConversation, mockClient, mockSupportTickets, getCoordinatesForLocation, calculateDistance } from '../constants';
// Fix: Import TicketStatus enum
import { Job, JobCategory, ApplicationStatus, UserRole, SupportTicket, TicketCategory, TicketMessage, TicketStatus, TicketPriority } from '../types';
import JobDetailView from './JobDetailView';
import MyProfilePage from './MyProfilePage';
import SavedJobsPage from './SavedJobsPage';
import MyApplicationsPage from './MyApplicationsPage';
import ReferralPage from './ReferralPage';
import EmergencyContactsPage from './EmergencyContactsPage';
import ChatPage from './ChatPage';
import TimesheetsPage from './TimesheetsPage';
import CurrencyConverterModal from '../components/CurrencyConverterModal';
import SupportTicketsPage from './SupportTicketsPage';
import TicketDetailView from './TicketDetailView';
import CreateTicketModal from '../components/CreateTicketModal';

type EmployeeView = 'jobList' | 'myProfile' | 'savedJobs' | 'myApplications' | 'referrals' | 'emergencyContacts' | 'messages' | 'timesheets' | 'tickets';

const currentEmployee = mockEmployees[0];

const EmployeeDashboard: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentView, setCurrentView] = useState<EmployeeView>('jobList');
  const [isChatting, setIsChatting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
      category: 'All',
      location: '',
      currency: 'All',
  });
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set([3]));
  const [applications, setApplications] = useState<Map<number, ApplicationStatus>>(new Map([[1, ApplicationStatus.Viewed], [4, ApplicationStatus.Applied], [3, ApplicationStatus.Completed]]));
  const [showConverter, setShowConverter] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  
  const employeeCoords = getCoordinatesForLocation(currentEmployee.location);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFilters(prev => ({...prev, [name]: value}));
  };

  const handleSaveToggle = (jobId: number) => {
    setSavedJobIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(jobId)) {
            newSet.delete(jobId);
        } else {
            newSet.add(jobId);
        }
        return newSet;
    });
  };

  const handleApply = (jobId: number) => {
    setApplications(prev => new Map(prev).set(jobId, ApplicationStatus.Applied));
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesCategory = filters.category === 'All' || job.category === filters.category;
    const matchesLocation = filters.location === '' || job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesSearch = searchTerm === '' || job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCurrency = filters.currency === 'All' || job.currency === filters.currency;
    return matchesCategory && matchesLocation && matchesSearch && matchesCurrency;
  });

  const handleNavClick = (view: EmployeeView) => {
    setCurrentView(view);
    setSelectedJob(null);
    setIsChatting(false);
    setSelectedTicket(null);
  }
  
  const handleCreateTicket = (ticketData: { subject: string, category: TicketCategory, description: string }) => {
    // FIX: Add missing userId and priority properties to the new ticket object.
    const newTicket: SupportTicket = {
      id: Date.now(),
      userId: currentEmployee.id,
      ...ticketData,
// Fix: Use TicketStatus enum instead of string literal
      status: TicketStatus.Open,
      priority: TicketPriority.Medium,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      messages: [
        {
          id: Date.now(),
          author: 'User',
          text: ticketData.description,
          timestamp: new Date().toLocaleString()
        }
      ]
    };
    setTickets(prev => [newTicket, ...prev]);
    setShowCreateTicketModal(false);
  };
  
  const handleTicketReply = (ticketId: number, replyText: string) => {
      const newMessage: TicketMessage = {
        id: Date.now(),
        author: 'User',
        text: replyText,
        timestamp: new Date().toLocaleString()
      };
      setTickets(prevTickets => prevTickets.map(ticket => 
        ticket.id === ticketId ? {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          lastUpdated: new Date().toISOString().split('T')[0]
        } : ticket
      ));
      setSelectedTicket(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
  };


  if (isChatting) {
    return (
       <ChatPage
          conversation={mockConversation}
          currentUser={{ profile: currentEmployee, role: UserRole.Employee }}
          otherUser={{ profile: mockClient, role: UserRole.Client }}
          onBack={() => {
            setIsChatting(false)
            setCurrentView('messages');
          }}
        />
    )
  }

  if (selectedJob) {
    return (
      <JobDetailView
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
        isSaved={savedJobIds.has(selectedJob.id)}
        onSaveToggle={() => handleSaveToggle(selectedJob.id)}
        applicationStatus={applications.get(selectedJob.id) || ApplicationStatus.NotApplied}
        onApply={() => handleApply(selectedJob.id)}
      />
    );
  }
  
  if (selectedTicket) {
    return <TicketDetailView ticket={selectedTicket} onBack={() => setSelectedTicket(null)} onReply={handleTicketReply} />;
  }

  const renderContent = () => {
    switch(currentView) {
      case 'myProfile':
        return <MyProfilePage onBack={() => handleNavClick('jobList')} />;
      case 'savedJobs':
        const savedJobs = mockJobs.filter(job => savedJobIds.has(job.id));
        return <SavedJobsPage savedJobs={savedJobs} onJobClick={setSelectedJob} />;
      case 'myApplications':
        return <MyApplicationsPage applications={applications} onJobClick={setSelectedJob} />;
      case 'referrals':
        return <ReferralPage onBack={() => handleNavClick('jobList')} />;
      case 'emergencyContacts':
        return <EmergencyContactsPage onBack={() => handleNavClick('jobList')} />;
      case 'timesheets':
        return <TimesheetsPage completedJobs={mockJobs.filter(j => applications.get(j.id) === ApplicationStatus.Completed)} />;
      case 'tickets':
        return <SupportTicketsPage tickets={tickets} onViewTicket={setSelectedTicket} onCreateTicket={() => setShowCreateTicketModal(true)} />;
      case 'messages':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">My Messages</h2>
             <div onClick={() => setIsChatting(true)} className="p-4 hover:bg-slate-50 cursor-pointer border rounded-lg">
                <p className="font-bold">{mockClient.name}</p>
                <p className="text-sm text-slate-600 truncate">{mockConversation.messages[mockConversation.messages.length - 1].text}</p>
             </div>
          </div>
        );
      case 'jobList':
      default:
        return (
           <div className="space-y-6">
            {filteredJobs.map(job => {
              const jobCoords = getCoordinatesForLocation(job.location);
              const distance = employeeCoords && jobCoords ? calculateDistance(employeeCoords, jobCoords) : null;
              return (
              <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start">
                <div>
                  <span className="text-xs font-semibold uppercase text-emerald-600 bg-emerald-100 px-2 py-1 rounded">{job.category}</span>
                  <h3 className="text-xl font-bold text-slate-800 mt-2">{job.title}</h3>
                  <p className="text-slate-500 mt-1">Posted by {job.clientName}</p>
                  <div className="flex flex-wrap items-center text-slate-500 my-2 text-sm gap-x-4 gap-y-1">
                      <span><i className="fas fa-map-marker-alt mr-2"></i>{job.location}</span>
                      {distance !== null && <span className="text-blue-600 font-semibold">(~{distance.toLocaleString()} km away)</span>}
                      <span><i className="fas fa-clock mr-2"></i>{job.duration}</span>
                      <span><i className="fas fa-money-bill-wave mr-1"></i>{job.hourlyRate ? `${job.hourlyRate}/${job.currency} hr` : `${job.salary.toLocaleString()} ${job.currency}`}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-left md:text-right">
                  <p className="text-sm text-slate-400">Posted on {job.postedDate}</p>
                  <button className="mt-2 bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            )})}
          </div>
        );
    }
  }

  const NavButton = ({ view, icon, label, onClick }: { view?: EmployeeView, icon: string, label: string, onClick?: () => void }) => (
    <button
        onClick={() => {
            if (onClick) {
                onClick();
            } else if(view) {
                handleNavClick(view);
            }
        }}
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
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 lg:w-1/5">
          <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
            <NavButton view="jobList" icon="fa-search" label="Find Jobs" />
            <NavButton view="myApplications" icon="fa-file-alt" label="Applications" />
            <NavButton view="savedJobs" icon="fa-bookmark" label="Saved Jobs" />
            <NavButton view="timesheets" icon="fa-clock" label="Timesheets" />
            <NavButton view="messages" icon="fa-comment-dots" label="Messages" />
            <NavButton view="myProfile" icon="fa-user-edit" label="My Profile" />
            <NavButton view="referrals" icon="fa-gift" label="Referrals" />
            <NavButton view="emergencyContacts" icon="fa-first-aid" label="Emergency" />
            <NavButton view="tickets" icon="fa-life-ring" label="Support Tickets" />
             <div className="pt-2 border-t mt-2">
                <NavButton icon="fa-exchange-alt" label="Currency Converter" onClick={() => setShowConverter(true)} />
            </div>
          </div>
        </aside>

        <div className="md:w-3/4 lg:w-4/5">
          {currentView === 'jobList' && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold mb-4">Find Your Next Opportunity</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input 
                  type="text"
                  placeholder="Search by title or keyword..."
                  className="md:col-span-4 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="All">All Categories</option>
                  {Object.values(JobCategory).map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <input 
                  type="text"
                  name="location"
                  placeholder="Location (e.g., Harare)"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                 <select 
                  name="currency"
                  value={filters.currency}
                  onChange={handleFilterChange}
                  className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="All">All Currencies</option>
                  <option value="USD">USD</option>
                  <option value="ZAR">ZAR</option>
                  <option value="RTGS">RTGS</option>
                </select>
              </div>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
      {showConverter && <CurrencyConverterModal onClose={() => setShowConverter(false)} />}
      {showCreateTicketModal && (
        <CreateTicketModal
          onClose={() => setShowCreateTicketModal(false)}
          onSubmit={handleCreateTicket}
        />
      )}
    </>
  );
};

export default EmployeeDashboard;
