import React, { useState, useRef } from 'react';
import { UserRole } from '../types';

interface SignUpPageProps {
  role: UserRole;
  onSignUp: () => void;
  onBack: () => void;
}

const roleDetails: Record<UserRole, { title: string; icon: string; color: string; borderColor: string }> = {
  [UserRole.Client]: { title: 'Client', icon: 'fas fa-home', color: 'text-emerald-500', borderColor: 'border-emerald-500' },
  [UserRole.Corporate]: { title: 'Corporate', icon: 'fas fa-building', color: 'text-blue-500', borderColor: 'border-blue-500' },
  [UserRole.Employee]: { title: 'Employee', icon: 'fas fa-briefcase', color: 'text-yellow-500', borderColor: 'border-yellow-500' },
  [UserRole.Admin]: { title: 'Admin', icon: 'fas fa-user-shield', color: 'text-slate-700', borderColor: 'border-slate-700' },
};

const SignUpPage: React.FC<SignUpPageProps> = ({ role, onSignUp, onBack }) => {
  const details = roleDetails[role];
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profilePicture) {
      setError('Please upload a profile picture to continue.');
      return;
    }
    // In a real app, you would submit all form data including the picture file
    console.log('Signing up...');
    onSignUp();
  };

  return (
    <div className="max-w-md mx-auto">
      <button onClick={onBack} className="mb-6 text-emerald-600 hover:text-emerald-800 font-semibold">
        <i className="fas fa-arrow-left mr-2"></i> Back to Sign In
      </button>
      <div className={`bg-white p-8 rounded-lg shadow-xl border-t-4 ${details.borderColor}`}>
        <div className="text-center mb-8">
          <i className={`${details.icon} ${details.color} text-5xl mb-4`}></i>
          <h2 className="text-3xl font-bold text-slate-800">Create {details.title} Account</h2>
          <p className="text-slate-500 mt-2">Join our community today!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePictureUpload}
              className="hidden"
              accept="image/*"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-2 border-dashed ${error ? 'border-red-500' : 'border-slate-300'} hover:border-emerald-500 hover:text-emerald-500 transition-colors`}
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="text-center">
                  <i className="fas fa-camera text-3xl"></i>
                  <span className="text-xs mt-1 block font-semibold">Upload Photo</span>
                </div>
              )}
            </button>
          </div>
          {error && <p className="text-sm text-red-600 text-center -mt-2">{error}</p>}
          
           <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input type="text" id="name" className="w-full p-3 border border-slate-300 rounded-md" required />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email or Phone Number
            </label>
            <input type="text" id="email" className="w-full p-3 border border-slate-300 rounded-md" required />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input type="password" id="password" className="w-full p-3 border border-slate-300 rounded-md" required />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;