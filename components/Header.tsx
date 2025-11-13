import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';
import { mockNotifications } from '../constants';

interface HeaderProps {
  userRole: UserRole | null;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ userRole, onLogoClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showSosModal, setShowSosModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const roleToViewMap: Record<UserRole, string> = {
    [UserRole.Client]: 'Client View',
    [UserRole.Employee]: 'Employee View',
    [UserRole.Corporate]: 'Corporate View',
    [UserRole.Admin]: 'Admin Panel',
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendAlert = () => {
    setAlertStatus('sending');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Emergency Alert Sent from:', position.coords.latitude, position.coords.longitude);
        setAlertStatus('sent');
        setShowSosModal(false);
        setTimeout(() => setAlertStatus('idle'), 10000); // Reset after 10 seconds
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Could not get your location. Please enable location services and try again.");
        setAlertStatus('idle');
        setShowSosModal(false);
      }
    );
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer"
            onClick={onLogoClick}
          >
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-emerald-600">
                Zimbabwe Maids Centre
              </h1>
              <p className="text-xs text-slate-500 italic">your number 1 online placement agency</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            {userRole && (
              <span className="hidden md:inline-block px-3 py-1 text-sm font-semibold text-emerald-800 bg-emerald-100 rounded-full">
                {roleToViewMap[userRole]}
              </span>
            )}
             {userRole === UserRole.Employee && (
              <button
                onClick={() => setShowSosModal(true)}
                disabled={alertStatus !== 'idle'}
                className="bg-red-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
                aria-label="Send Emergency SOS Alert"
              >
                <i className="fas fa-exclamation-triangle"></i>
                <span className="hidden md:inline">{alertStatus === 'sent' ? 'Alert Sent' : 'SOS'}</span>
              </button>
            )}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-slate-600 hover:text-emerald-600 relative"
                aria-label="Notifications"
              >
                <i className="fas fa-bell text-xl"></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                  <div className="p-3 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800">Notifications</h4>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map(notification => (
                      <div key={notification.id} className={`p-3 border-b border-slate-100 ${!notification.read ? 'bg-emerald-50' : ''}`}>
                        <p className="text-sm text-slate-700">{notification.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{notification.date}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center">
                    <button className="text-sm text-emerald-600 font-semibold hover:underline">View all</button>
                  </div>
                </div>
              )}
            </div>
            <button className="text-slate-600 hover:text-emerald-600">
              <i className="fas fa-user-circle text-xl"></i>
            </button>
          </nav>
        </div>
      </header>

      {showSosModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <i className="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Emergency Alert</h3>
            <p className="text-slate-600 mb-8">
              Are you sure you want to send an emergency alert? This will share your current location with your emergency contacts and the admin team.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowSosModal(false)}
                disabled={alertStatus === 'sending'}
                className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAlert}
                disabled={alertStatus === 'sending'}
                className="py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-colors flex items-center justify-center min-w-[150px]"
              >
                {alertStatus === 'sending' ? (
                   <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  'Yes, Send Alert'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
