import React, { useState, useMemo } from 'react';
import { mockEmployees, mockConversation, mockClient, mockTransactions, mockSupportTickets, getCoordinatesForLocation, calculateDistance, PROFILE_VIEW_LIMIT, ACCESS_PERIOD_DAYS, ACCESS_FEE } from '../constants';
import { EmployeeProfile, JobCategory, UserRole, SubscriptionPlan, BadgeType, Transaction, SupportTicket, TicketCategory, TicketMessage, TicketStatus, Currency, AvailabilityStatus, Language, TicketPriority } from '../types';
import StarRating from '../components/StarRating';
import EmployeeProfileView from './EmployeeProfileView';
import ChatPage from './ChatPage';
import TransactionHistoryPage from './TransactionHistoryPage';
import PostJobPage from './PostJobPage';
import SubscriptionPage from './SubscriptionPage';
import ApproveTimesheetsPage from './ApproveTimesheetsPage';
import CurrencyConverterModal from '../components/CurrencyConverterModal';
import RefundRequestModal from '../components/RefundRequestModal';
import SupportTicketsPage from './SupportTicketsPage';
import CreateTicketModal from '../components/CreateTicketModal';
import TicketDetailView from './TicketDetailView';
import MyEmployeesPage from './MyEmployeesPage';
import AccessPaymentModal from '../components/AccessPaymentModal';
import HirePaymentModal from '../components/HirePaymentModal';

type ClientView = 'browse' | 'myEmployees' | 'transactions' | 'postJob' | 'subscription' | 'timesheets' | 'tickets';

const ClientDashboard: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<EmployeeProfile | null>(null);
  const [chattingWith, setChattingWith] = useState<EmployeeProfile | null>(null);
  const [currentView, setCurrentView] = useState<ClientView>('browse');
  const [clientProfile, setClientProfile] = useState(mockClient);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [showConverter, setShowConverter] = useState(false);
  const [selectedTxForRefund, setSelectedTxForRefund] = useState<Transaction | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  
  const [showAccessPaymentModal, setShowAccessPaymentModal] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<'hire' | 'browse' | null>(null);
  
  const [showHirePaymentModal, setShowHirePaymentModal] = useState(false);
  const [hiringDetails, setHiringDetails] = useState<{ employee: EmployeeProfile; type: 'long-term' | 'once-off' } | null>(null);


  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
      role: 'All',
      location: '',
      verified: false,
      backgroundChecked: false,
      policeClearanceVerified: false,
      referenceChecked: false,
      medicalClearance: false,
      eliteWorkersOnly: false,
      availability: 'All',
      language: 'All',
      hasDriversLicense: false,
      certification: '',
  });
  const [sortBy, setSortBy] = useState('rating');

  const isPremium = clientProfile.subscription === SubscriptionPlan.Premium;
  const clientCoords = getCoordinatesForLocation(clientProfile.location);

  const checkAccess = () => {
    if (clientProfile.hasPaidForAccess && clientProfile.accessStartDate) {
      const startDate = new Date(clientProfile.accessStartDate);
      const daysPassed = (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      if (daysPassed > ACCESS_PERIOD_DAYS) {
        // Access has expired
        setClientProfile(prev => ({ ...prev, hasPaidForAccess: false, viewedProfileCount: 0, accessStartDate: null }));
        return false;
      }
      return true; // Access is valid
    }
    return false; // No paid access
  };

  const handleViewProfile = (employee: EmployeeProfile) => {
    const hasValidAccess = checkAccess();
    if (hasValidAccess) {
      setSelectedProfile(employee);
      return;
    }

    if (clientProfile.viewedProfileCount < PROFILE_VIEW_LIMIT) {
      setClientProfile(prev => ({ ...prev, viewedProfileCount: prev.viewedProfileCount + 1 }));
      setSelectedProfile(employee);
    } else {
      setPaymentIntent('browse');
      setShowAccessPaymentModal(true);
    }
  };

  const handleHireAttempt = (employee: EmployeeProfile, hireType: 'long-term' | 'once-off') => {
    const hasValidAccess = checkAccess();
    if (hasValidAccess) {
        setHiringDetails({ employee, type: hireType });
        setShowHirePaymentModal(true);
    } else {
        setPaymentIntent('hire');
        setHiringDetails({ employee, type: hireType });
        setShowAccessPaymentModal(true);
    }
  };

  const handleAccessPaymentSuccess = (confirmationCode: string) => {
    const newTransaction: Transaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        description: `30-Day Hiring Access Fee`,
        amount: ACCESS_FEE,
        currency: Currency.USD,
        status: 'Completed',
        type: 'Access',
        paymentConfirmationCode: confirmationCode,
    };
    setTransactions(prev => [newTransaction, ...prev]);

    setClientProfile(prev => ({
        ...prev,
        hasPaidForAccess: true,
        accessStartDate: new Date().toISOString(),
        viewedProfileCount: 0,
    }));
    
    setShowAccessPaymentModal(false);

    if (paymentIntent === 'hire' && hiringDetails) {
        setShowHirePaymentModal(true);
    }
    
    setPaymentIntent(null);
  };

  const handleHirePaymentSuccess = (confirmationCode: string) => {
    if (!hiringDetails) return;

    const { employee, type } = hiringDetails;

    if (type === 'long-term') {
      if (clientProfile.hiredEmployeeIds.includes(employee.id)) {
        alert("This employee is already in your team.");
        return;
      }
      setClientProfile(prev => ({
        ...prev,
        hiredEmployeeIds: [...prev.hiredEmployeeIds, employee.id]
      }));
    }

    const isPremium = employee.badges.includes(BadgeType.PremiumEmployee);
    const fee = type === 'long-term' ? (isPremium ? 120 : 40) : 20;
    const description = type === 'long-term' 
        ? `Placement fee for ${employee.name}`
        : `Once-off hire fee for ${employee.name}`;

    const newTransaction: Transaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      description,
      amount: fee,
      currency: Currency.USD,
      status: 'Completed',
      type: 'Hire',
      paymentConfirmationCode: confirmationCode,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    alert(`${employee.name} has been successfully hired! A transaction has been created.`);
    
    setShowHirePaymentModal(false);
    setHiringDetails(null);
    setSelectedProfile(null);
  };

  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFilters(prev => ({...prev, [name]: checked}));
      } else {
        setFilters(prev => ({...prev, [name]: value}));
      }
  };

  const filteredAndSortedEmployees = useMemo(() => {
    return mockEmployees
      .filter(employee => {
        const matchesRole = filters.role === 'All' || employee.role === filters.role;
        const matchesLocation = filters.location === '' || employee.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesSearch = searchTerm === '' || employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || employee.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesVerified = !filters.verified || employee.verified;
        const matchesBackgroundChecked = !filters.backgroundChecked || employee.backgroundChecked;
        const matchesPoliceClearance = !filters.policeClearanceVerified || employee.policeClearanceVerified;
        const matchesReferenceChecked = !filters.referenceChecked || employee.referenceChecked;
        const matchesMedicalClearance = !filters.medicalClearance || employee.medicalClearance;
        const matchesElite = !filters.eliteWorkersOnly || (isPremium && employee.badges.includes(BadgeType.EliteWorker));
        const matchesAvailability = filters.availability === 'All' || employee.availability === filters.availability;
        const matchesLanguage = filters.language === 'All' || employee.languages.includes(filters.language as Language);
        const matchesDriversLicense = !filters.hasDriversLicense || employee.hasDriversLicense;
        const matchesCertification = filters.certification === '' || employee.certifications.some(cert => cert.toLowerCase().includes(filters.certification.toLowerCase()));

        return matchesRole && matchesLocation && matchesSearch && matchesVerified && matchesBackgroundChecked && matchesPoliceClearance && matchesReferenceChecked && matchesMedicalClearance && matchesElite && matchesAvailability && matchesLanguage && matchesDriversLicense && matchesCertification;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
            return b.rating - a.rating;
        }
        if (sortBy === 'experience') {
            return b.experience - a.experience;
        }
        return 0;
      });
  }, [searchTerm, filters, sortBy, isPremium]);

  const handleBack = () => {
    setSelectedProfile(null);
    setChattingWith(null);
    setSelectedTicket(null);
  }
  
  const handleUpgrade = () => {
    setClientProfile(prev => ({...prev, subscription: SubscriptionPlan.Premium}));
    setCurrentView('browse');
    alert('Congratulations! You are now a Premium member.');
  }

  const handleBackToDashboard = () => {
    setCurrentView('browse');
  };
  
  const handleRefundSubmit = (details: { reason: string; comments: string }) => {
    if (!selectedTxForRefund) return;
    console.log('Refund Request Submitted:', {
        transactionId: selectedTxForRefund.id,
        ...details
    });
    
    setTransactions(prev => 
        prev.map(tx => 
            tx.id === selectedTxForRefund.id ? {...tx, refundStatus: 'Requested'} : tx
        )
    );

    setSelectedTxForRefund(null);
    alert('Your refund request has been submitted for review.');
  };
  
  const handleCreateTicket = (ticketData: { subject: string, category: TicketCategory, description: string }) => {
    const newTicket: SupportTicket = {
      id: Date.now(),
      userId: clientProfile.id,
      ...ticketData,
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

  const renderBrowseView = () => (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Find Your Perfect Helper</h2>
         <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
            <h4 className="font-bold text-blue-800">How Hiring Works</h4>
            <p className="text-sm text-blue-700">
                You can browse <strong>{PROFILE_VIEW_LIMIT} profiles for free</strong>. To hire or view more, a <strong>${ACCESS_FEE} access fee</strong> is required, granting you 30 days of full access. A separate placement fee applies upon a successful hire.
            </p>
        </div>
        {!isPremium && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-yellow-800">Unlock Premium Features</h4>
              <p className="text-sm text-yellow-700">Upgrade to view our top-rated "Elite" workers and get priority support.</p>
            </div>
            <button onClick={() => setCurrentView('subscription')} className="bg-yellow-400 text-yellow-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors">
              Upgrade Now
            </button>
          </div>
        )}
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Search by name or skill..."
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <select 
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="All">All Roles</option>
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
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
              className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="All">All Availabilities</option>
              {Object.values(AvailabilityStatus).map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <select 
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
              className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="All">All Languages</option>
              {Object.values(Language).map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
            <input 
              type="text"
              name="certification"
              placeholder="Filter by certification..."
              value={filters.certification}
              onChange={handleFilterChange}
              className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <select 
              name="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="verified" checked={filters.verified} onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span>Verified</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="backgroundChecked" checked={filters.backgroundChecked} onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span>Background Checked</span>
            </label>
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="policeClearanceVerified" checked={filters.policeClearanceVerified} onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span>Police Clearance</span>
            </label>
             <label className={`flex items-center space-x-2 ${!isPremium ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input type="checkbox" name="hasDriversLicense" checked={filters.hasDriversLicense} onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" disabled={!isPremium} />
                <span>Driver's License</span>
            </label>
            <label className={`flex items-center space-x-2 ${!isPremium ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input type="checkbox" name="referenceChecked" checked={filters.referenceChecked} onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" disabled={!isPremium} />
                <span>Reference Checked</span>
            </label>
            <label className={`flex items-center space-x-2 ${!isPremium ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input type="checkbox" name="medicalClearance" checked={filters.medicalClearance} onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" disabled={!isPremium} />
                <span>Medical Clearance</span>
            </label>
            <label className={`flex items-center space-x-2 ${!isPremium ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input type="checkbox" name="eliteWorkersOnly" checked={filters.eliteWorkersOnly} onChange={handleFilterChange} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" disabled={!isPremium} />
                <span className="flex items-center gap-1.5"><i className="fas fa-gem text-purple-500"></i> Elite Workers</span>
            </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAndSortedEmployees.map(employee => {
          const employeeCoords = getCoordinatesForLocation(employee.location);
          const distance = clientCoords && employeeCoords ? calculateDistance(clientCoords, employeeCoords) : null;
          return (
            <div key={employee.id} onClick={() => handleViewProfile(employee)} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer flex flex-col">
              <div className="relative">
                <img src={employee.profilePictureUrl} alt={employee.name} className="w-full h-56 object-cover" />
                <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                  {employee.badges.includes(BadgeType.EliteWorker) && (
                     <span className="bg-purple-500 text-white px-3 py-1 text-xs font-semibold rounded-full flex items-center shadow-md">
                      <i className="fas fa-gem mr-1.5"></i> Elite Worker
                    </span>
                  )}
                  {employee.verified && (
                    <span className="bg-emerald-500 text-white px-3 py-1 text-xs font-semibold rounded-full flex items-center shadow-md">
                      <i className="fas fa-check-circle mr-1.5"></i> Verified
                    </span>
                  )}
                   {employee.policeClearanceVerified && (
                    <span className="bg-slate-600 text-white px-3 py-1 text-xs font-semibold rounded-full flex items-center shadow-md">
                      <i className="fas fa-user-shield mr-1.5"></i> Police Clearance
                    </span>
                  )}
                  {employee.referenceChecked && (
                    <span className="bg-sky-500 text-white px-3 py-1 text-xs font-semibold rounded-full flex items-center shadow-md">
                      <i className="fas fa-user-check mr-1.5"></i> Reference Checked
                    </span>
                  )}
                  {employee.medicalClearance && (
                    <span className="bg-pink-500 text-white px-3 py-1 text-xs font-semibold rounded-full flex items-center shadow-md">
                      <i className="fas fa-notes-medical mr-1.5"></i> Medical Clearance
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800">{employee.name}</h3>
                <p className="text-emerald-600 font-semibold">{employee.role}</p>
                <div className="flex items-center text-slate-500 my-2">
                  <i className="fas fa-map-marker-alt mr-2"></i> {employee.location}
                  {distance !== null && <span className="ml-2 text-blue-600 font-semibold">(~{distance.toLocaleString()} km away)</span>}
                </div>
                <div className="flex items-center space-x-2">
                   <StarRating rating={employee.rating} />
                   <span className="text-slate-600">({employee.rating.toFixed(1)})</span>
                </div>
                <p className="text-slate-600 mt-4 h-16 overflow-hidden text-ellipsis flex-grow">
                  {employee.bio}
                </p>
                <div className="mt-4 text-right">
                  <span className="text-emerald-600 font-semibold hover:text-emerald-800">
                    View Profile <i className="fas fa-arrow-right ml-1"></i>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  );

  const renderContent = () => {
    if (chattingWith) {
      return (
        <ChatPage
          conversation={mockConversation}
          currentUser={{ profile: clientProfile, role: UserRole.Client }}
          otherUser={{ profile: chattingWith, role: UserRole.Employee }}
          onBack={handleBack}
        />
      );
    }
    if (selectedProfile) {
      return <EmployeeProfileView 
        employee={selectedProfile} 
        onBack={handleBack} 
        onStartChat={setChattingWith} 
        onHireEmployee={handleHireAttempt}
        hiredEmployeeIds={clientProfile.hiredEmployeeIds}
      />;
    }
    if (selectedTicket) {
      return <TicketDetailView ticket={selectedTicket} onBack={handleBack} onReply={handleTicketReply} />;
    }
    switch(currentView) {
      case 'myEmployees':
        const hiredEmployees = mockEmployees.filter(emp => clientProfile.hiredEmployeeIds.includes(emp.id));
        return <MyEmployeesPage employees={hiredEmployees} onViewProfile={setSelectedProfile} onStartChat={setChattingWith} />;
      case 'transactions':
        return <TransactionHistoryPage transactions={transactions} onRefundRequest={setSelectedTxForRefund} />;
      case 'postJob':
        return <PostJobPage onBack={handleBackToDashboard} />;
      case 'subscription':
        return <SubscriptionPage currentPlan={clientProfile.subscription} onUpgrade={handleUpgrade} />;
      case 'timesheets':
        return <ApproveTimesheetsPage setTransactions={setTransactions}/>;
      case 'tickets':
        return <SupportTicketsPage tickets={tickets} onViewTicket={setSelectedTicket} onCreateTicket={() => setShowCreateTicketModal(true)} />;
      case 'browse':
      default:
        return renderBrowseView();
    }
  };
  
  const NavButton = ({ view, icon, label, onClick }: { view?: ClientView, icon: string, label: string, onClick?: () => void }) => (
    <button
        onClick={() => {
            if (onClick) {
                onClick();
            } else if (view) {
                setCurrentView(view);
                setSelectedProfile(null);
                setChattingWith(null);
                setSelectedTicket(null);
            }
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
            currentView === view && !selectedProfile && !chattingWith && !selectedTicket
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
            <NavButton view="browse" icon="fa-search" label="Browse Employees" />
            <NavButton view="myEmployees" icon="fa-users" label="My Employees" />
            <NavButton view="postJob" icon="fa-plus-circle" label="Post a Job" />
            <NavButton view="timesheets" icon="fa-clock" label="Timesheets" />
            <NavButton view="transactions" icon="fa-receipt" label="Transactions" />
            <NavButton view="subscription" icon="fa-gem" label="Subscription" />
            <NavButton view="tickets" icon="fa-life-ring" label="Support Tickets" />
            <div className="pt-2 border-t mt-2">
              <NavButton icon="fa-exchange-alt" label="Currency Converter" onClick={() => setShowConverter(true)} />
            </div>
          </div>
        </aside>
        <div className="md:w-3/4 lg:w-4/5">
          {renderContent()}
        </div>
      </div>
      {showConverter && <CurrencyConverterModal onClose={() => setShowConverter(false)} />}
      {selectedTxForRefund && (
        <RefundRequestModal 
            transaction={selectedTxForRefund}
            onClose={() => setSelectedTxForRefund(null)}
            onSubmit={handleRefundSubmit}
        />
      )}
      {showCreateTicketModal && (
        <CreateTicketModal
          onClose={() => setShowCreateTicketModal(false)}
          onSubmit={handleCreateTicket}
        />
      )}
      {showAccessPaymentModal && (
        <AccessPaymentModal 
          onClose={() => {
            setShowAccessPaymentModal(false);
            setHiringDetails(null);
          }}
          onSubmit={handleAccessPaymentSuccess}
        />
      )}
      {showHirePaymentModal && hiringDetails && (
        <HirePaymentModal
          employeeName={hiringDetails.employee.name}
          fee={hiringDetails.type === 'long-term' ? (hiringDetails.employee.badges.includes(BadgeType.PremiumEmployee) ? 120 : 40) : 20}
          onClose={() => {
            setShowHirePaymentModal(false);
            setHiringDetails(null);
          }}
          onSubmit={handleHirePaymentSuccess}
        />
      )}
    </>
  );
};

export default ClientDashboard;