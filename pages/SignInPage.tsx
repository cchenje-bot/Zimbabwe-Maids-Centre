import React from 'react';
import { UserRole } from '../types';

interface SignInPageProps {
  role: UserRole;
  onSignIn: () => void;
  onForgotPassword: () => void;
  onGoToSignUp: () => void;
  onBack: () => void;
}

const roleDetails: Record<UserRole, { title: string; icon: string; color: string; borderColor: string }> = {
  [UserRole.Client]: { title: 'Client', icon: 'fas fa-home', color: 'text-emerald-500', borderColor: 'border-emerald-500' },
  [UserRole.Corporate]: { title: 'Corporate', icon: 'fas fa-building', color: 'text-blue-500', borderColor: 'border-blue-500' },
  [UserRole.Employee]: { title: 'Employee', icon: 'fas fa-briefcase', color: 'text-yellow-500', borderColor: 'border-yellow-500' },
  [UserRole.Admin]: { title: 'Admin', icon: 'fas fa-user-shield', color: 'text-slate-700', borderColor: 'border-slate-700' },
};

const SignInPage: React.FC<SignInPageProps> = ({ role, onSignIn, onForgotPassword, onGoToSignUp, onBack }) => {
  const details = roleDetails[role];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    onSignIn();
  };

  return (
    <div className="max-w-md mx-auto">
       <button onClick={onBack} className="mb-6 text-emerald-600 hover:text-emerald-800 font-semibold">
          <i className="fas fa-arrow-left mr-2"></i> Back to Role Selection
        </button>
      <div className={`bg-white p-8 rounded-lg shadow-xl border-t-4 ${details.borderColor}`}>
        <div className="text-center mb-8">
          <i className={`${details.icon} ${details.color} text-5xl mb-4`}></i>
          <h2 className="text-3xl font-bold text-slate-800">Sign In as {details.title}</h2>
          <p className="text-slate-500 mt-2">Enter your credentials to access your dashboard.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email or Phone Number
            </label>
            <input
              type="text"
              id="email"
              defaultValue={role === UserRole.Employee ? 'rutendo.moyo@example.com' : 'moyo.family@example.com'}
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              defaultValue="password123"
              className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-semibold text-emerald-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg"
            >
              Sign In
            </button>
          </div>
        </form>
         <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button
                    type="button"
                    onClick={onGoToSignUp}
                    className="font-semibold text-emerald-600 hover:underline"
                >
                    Sign Up
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;