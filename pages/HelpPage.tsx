import React, { useState } from 'react';
import { paymentDetails } from '../constants';

const FAQItem = ({ q, a }: { q: string, a: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 px-2 flex justify-between items-center text-slate-800 hover:bg-slate-50"
      >
        <span className="font-semibold">{q}</span>
        <i className={`fas fa-chevron-down transform transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="p-4 bg-white text-slate-600">
          {a}
        </div>
      )}
    </div>
  );
};

const HelpPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const faqs = [
    { q: "How do I create an account?", a: "You can create an account by clicking the 'Sign Up' button on the homepage. You'll be asked to choose whether you are a 'Client' looking to hire, or an 'Employee' looking for work." },
    { q: "How do I verify my profile as an employee?", a: "To get a 'Verified' badge, you need to submit your national ID and any relevant certifications through your profile page. Our admin team will review your documents and approve your profile within 48 hours." },
    { q: "How can I be sure the employees are trustworthy?", a: "We encourage all clients to look for employees with 'Verified' and 'Background Checked' badges. Always check reviews from other clients and conduct an interview before hiring." },
    { q: "What are the fees and how do I pay?", a: (
        <div className="space-y-6">
            <p>Our platform uses a fee-based model for both clients and employees. All payments require a confirmation code to be finalized.</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <h4 className="font-bold text-blue-800">Important: Payment Confirmation</h4>
                <p className="text-sm text-blue-700">
                    After making a payment using any method, you <strong>must</strong> send your proof of payment to our WhatsApp number <strong>+263785458828</strong>. We will send you a confirmation code back. You need to enter this code on the platform to complete your transaction.
                </p>
            </div>

            <div>
                <h4 className="font-bold text-slate-800">For Clients:</h4>
                <ol className="list-decimal list-inside ml-4 space-y-2">
                    <li>
                        <strong>Access Fee ($10 USD):</strong> To begin the hiring process or after viewing 4 free profiles, a non-refundable <strong>$10 access fee</strong> is required. This payment unlocks the ability to hire and view more profiles for 30 days.
                    </li>
                    <li>
                        <strong>Placement Fee (Upon Hire):</strong>
                        <ul className="list-disc list-inside ml-6">
                            <li>Hiring a General Employee: <strong>$40 USD</strong></li>
                            <li>Hiring a Premium Employee: <strong>$120 USD</strong></li>
                            <li>Once-off Hire (e.g. single day cleaning): <strong>$20 USD</strong></li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div>
                <h4 className="font-bold text-slate-800">For Employees:</h4>
                <ul className="list-disc list-inside ml-4">
                    <li>General Employee Placement Fee: <strong>$30 USD</strong></li>
                    <li>Premium Employee Placement Fee: <strong>$100 USD</strong></li>
                </ul>
                 <p className="text-sm text-slate-500 mt-1">Note: Employee fees may be deducted from the first month's salary by arrangement.</p>
            </div>

            <div>
                <h4 className="font-bold text-slate-800">Payment Methods:</h4>
                 <div className="space-y-4 mt-2">
                    <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-400">
                        <h5 className="font-semibold flex items-center gap-2"><i className="fab fa-paypal text-blue-600"></i> PayPal (Recommended for International)</h5>
                        <p className="mt-2">
                            Please send payments in USD to our PayPal email: <strong className="text-emerald-600 font-mono">{paymentDetails.paypal.email}</strong>.
                        </p>
                    </div>
                     <div className="p-4 bg-slate-50 rounded-lg">
                        <h5 className="font-semibold">Other Payment Methods</h5>
                        <p className="mb-2">For the methods below, please contact us on WhatsApp at <strong>+263785458828</strong> for the latest details before sending payment.</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Ecocash / Inbucks:</strong> {paymentDetails.mobileMoney.account}</li>
                            <li><strong>Mukuru / WorldRemit:</strong> Contact us for details.</li>
                            <li><strong>Cash Payment:</strong> Can be made at our office at {paymentDetails.cash.address}. Please call ahead.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    ) },
    { q: "How do I post a job?", a: "As a client, you can post a job from your dashboard. Fill in the details like job description, location, salary, and requirements. Your job will then be visible to all employees." },
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Help & Support</h2>
        <button onClick={onBack} className="text-emerald-600 hover:text-emerald-800 font-semibold">
          <i className="fas fa-arrow-left mr-2"></i> Back to App
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Frequently Asked Questions (FAQ)</h3>
        <div className="bg-white rounded-lg border border-slate-200">
          {faqs.map((faq, index) => <FAQItem key={index} q={faq.q} a={faq.a} />)}
        </div>
      </div>
      
      <div className="mt-8 bg-emerald-50 p-6 rounded-lg border border-emerald-200 text-center">
        <h3 className="text-xl font-bold text-emerald-800 mb-2">Need Further Assistance?</h3>
        <p className="text-emerald-700">For any placement issues, please contact us directly:</p>
        <p className="text-lg font-bold text-emerald-900 mt-2">
          <i className="fas fa-phone-alt mr-2"></i> +263 773 022 135
        </p>
      </div>
    </div>
  );
};

export default HelpPage;