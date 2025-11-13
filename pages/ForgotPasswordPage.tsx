import React, { useState } from 'react';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Sending OTP to ${phoneNumber}`);
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setIsLoading(true);
    // Simulate API call to verify OTP and reset password
    setTimeout(() => {
      console.log(`Password reset for ${phoneNumber} with OTP ${otp}`);
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 'phone':
        return (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+263 77 123 4567"
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg flex items-center justify-center disabled:bg-slate-400"
              >
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Send OTP'}
              </button>
            </div>
          </form>
        );
      case 'otp':
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <p className="text-sm text-slate-600 text-center">
              An OTP has been sent to <strong>{phoneNumber}</strong>. Please enter it below.
            </p>
             <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">
                One-Time Password (OTP)
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center tracking-[0.5em] md:tracking-[1em]"
                required
                autoComplete="one-time-code"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
             <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg flex items-center justify-center disabled:bg-slate-400"
              >
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Reset Password'}
              </button>
            </div>
          </form>
        );
      case 'success':
        return (
          <div className="text-center space-y-6">
            <i className="fas fa-check-circle text-6xl text-emerald-500"></i>
            <h3 className="text-2xl font-bold text-slate-800">Password Reset Successful!</h3>
            <p className="text-slate-600">You can now sign in with your new password.</p>
            <button
              onClick={onBack}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg"
            >
              Back to Sign In
            </button>
          </div>
        );
    }
  };

  const titles = {
    phone: 'Forgot Your Password?',
    otp: 'Enter Verification Code',
    success: 'Success!',
  };
  
  const subtitles = {
    phone: "Enter your phone number and we'll send you an OTP to reset your password.",
    otp: 'Check your phone for the verification code.',
    success: '',
  };


  return (
    <div className="max-w-md mx-auto">
      {step !== 'success' && (
        <button onClick={onBack} className="mb-6 text-emerald-600 hover:text-emerald-800 font-semibold">
          <i className="fas fa-arrow-left mr-2"></i> Back to Sign In
        </button>
      )}
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">{titles[step]}</h2>
          {subtitles[step] && <p className="text-slate-500 mt-2">{subtitles[step]}</p>}
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
