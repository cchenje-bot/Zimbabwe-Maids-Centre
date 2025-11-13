import React, { useState } from 'react';
import { UserRole } from './types';
import LandingPage from './pages/LandingPage';
import ClientDashboard from './pages/ClientDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import HelpPage from './pages/HelpPage';
import CorporateDashboard from './pages/CorporateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SignInPage from './pages/SignInPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SignUpPage from './pages/SignUpPage';

type View = 'landing' | 'signIn' | 'signUp' | 'forgotPassword' | 'dashboard' | 'help';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [view, setView] = useState<View>('landing');

  const handleBackToLanding = () => {
    setUserRole(null);
    setView('landing');
  };

  const renderContent = () => {
    switch (view) {
      case 'help':
        return <HelpPage onBack={() => setView(userRole ? 'dashboard' : 'landing')} />;
      case 'forgotPassword':
        return <ForgotPasswordPage onBack={() => setView('signIn')} />;
      case 'signUp':
        if (!userRole) {
          // Fallback in case role is not set
          return <LandingPage onSelectRole={(role) => {
            setUserRole(role);
            setView('signIn');
          }} />;
        }
        return <SignUpPage
          role={userRole}
          onSignUp={() => setView('dashboard')}
          onBack={() => setView('signIn')}
        />;
      case 'signIn':
        if (!userRole) {
          // Fallback in case role is not set
          return <LandingPage onSelectRole={(role) => {
            setUserRole(role);
            setView('signIn');
          }} />;
        }
        return <SignInPage
          role={userRole}
          onSignIn={() => setView('dashboard')}
          onForgotPassword={() => setView('forgotPassword')}
          onGoToSignUp={() => setView('signUp')}
          onBack={handleBackToLanding}
        />;
      case 'dashboard':
        if (!userRole) {
           // If somehow we are on dashboard without a role, go back to landing
           return <LandingPage onSelectRole={(role) => {
            setUserRole(role);
            setView('signIn');
          }} />;
        }
        switch (userRole) {
          case UserRole.Client:
            return <ClientDashboard />;
          case UserRole.Corporate:
            return <CorporateDashboard />;
          case UserRole.Employee:
            return <EmployeeDashboard />;
          case UserRole.Admin:
            return <AdminDashboard />;
          default:
            return <LandingPage onSelectRole={(role) => {
                setUserRole(role);
                setView('signIn');
            }} />;
        }
      case 'landing':
      default:
        return <LandingPage onSelectRole={(role) => {
          setUserRole(role);
          setView('signIn');
        }} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <Header userRole={view === 'dashboard' ? userRole : null} onLogoClick={handleBackToLanding} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <Footer onShowHelp={() => setView('help')} />
    </div>
  );
};

export default App;