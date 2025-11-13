import React from 'react';
import { UserRole, BadgeType } from '../types';
import { mockEmployees } from '../constants';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const premiumEmployees = mockEmployees.filter(e => e.badges.includes(BadgeType.PremiumEmployee));

  return (
    <>
      <div className="text-center">
        <div className="max-w-4xl mx-auto py-12 md:py-24">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Connecting Homes & Businesses,
            <br />
            <span className="text-emerald-600">Empowering Lives.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Welcome to the Zimbabwe Maids Centre, the most trusted platform for finding reliable domestic help. Browse a selection of profiles for free, and hire talented workers from Zimbabwe for local or international placement.
          </p>
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-slate-800">I am a...</h3>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div
                onClick={() => onSelectRole(UserRole.Client)}
                className="group p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-t-4 border-transparent hover:border-emerald-500"
              >
                <i className="fas fa-home text-5xl text-emerald-500 mb-4"></i>
                <h4 className="text-2xl font-semibold text-slate-900">Client</h4>
                <p className="mt-2 text-slate-500">
                  Looking to hire domestic workers for your home.
                </p>
              </div>
               <div
                onClick={() => onSelectRole(UserRole.Corporate)}
                className="group p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-t-4 border-transparent hover:border-blue-500"
              >
                <i className="fas fa-building text-5xl text-blue-500 mb-4"></i>
                <h4 className="text-2xl font-semibold text-slate-900">Corporate</h4>
                <p className="mt-2 text-slate-500">
                  Hiring for your business.
                </p>
              </div>
              <div
                onClick={() => onSelectRole(UserRole.Employee)}
                className="group p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-t-4 border-transparent hover:border-yellow-500"
              >
                <i className="fas fa-briefcase text-5xl text-yellow-500 mb-4"></i>
                <h4 className="text-2xl font-semibold text-slate-900">Employee</h4>
                <p className="mt-2 text-slate-500">
                  A skilled worker looking for job opportunities.
                </p>
              </div>
              <div
                onClick={() => onSelectRole(UserRole.Admin)}
                className="group p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-t-4 border-transparent hover:border-slate-700"
              >
                <i className="fas fa-user-shield text-5xl text-slate-700 mb-4"></i>
                <h4 className="text-2xl font-semibold text-slate-900">Admin</h4>
                <p className="mt-2 text-slate-500">
                  Manage users, jobs, and platform settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {premiumEmployees.length > 0 && (
        <div className="bg-slate-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Meet Our Premium Employees
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              A selection of our most qualified and thoroughly vetted professionals. These candidates come with extra qualifications to meet the highest standards.
            </p>
            <p className="mt-2 text-sm text-slate-500 font-semibold">
              A one-time placement fee of $120 applies for hiring a premium employee.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumEmployees.map(employee => (
                <div key={employee.id} className="bg-white rounded-lg shadow-xl overflow-hidden text-left transform transition-transform duration-300 hover:-translate-y-2 border-t-4 border-amber-400">
                  <img src={employee.profilePictureUrl} alt={employee.name} className="w-full h-56 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-800">{employee.name}</h3>
                    <p className="text-emerald-600 font-semibold mb-4">{employee.role}</p>
                    
                    <ul className="space-y-2 text-slate-700 text-sm">
                      {employee.hasDegreeOrDiploma && (
                         <li className="flex items-center gap-3"><i className="fas fa-graduation-cap text-emerald-500 w-5 text-center"></i> Degree / Diploma</li>
                      )}
                      {employee.hasDriversLicense && (
                        <li className="flex items-center gap-3"><i className="fas fa-id-card text-emerald-500 w-5 text-center"></i> Driver's License</li>
                      )}
                      {employee.medicalClearance && (
                         <li className="flex items-center gap-3"><i className="fas fa-notes-medical text-emerald-500 w-5 text-center"></i> Medicals Cleared</li>
                      )}
                      {employee.referenceChecked && (
                        <li className="flex items-center gap-3"><i className="fas fa-user-check text-emerald-500 w-5 text-center"></i> References Checked</li>
                      )}
                      {employee.policeClearanceVerified && (
                         <li className="flex items-center gap-3"><i className="fas fa-user-shield text-emerald-500 w-5 text-center"></i> Police Clearance</li>
                      )}
                       {employee.certifications.includes('First Aid Certificate') && (
                         <li className="flex items-center gap-3"><i className="fas fa-first-aid text-emerald-500 w-5 text-center"></i> First Aid Certificate</li>
                      )}
                       {employee.certifications.includes('Housekeeping Certificate') && (
                         <li className="flex items-center gap-3"><i className="fas fa-broom text-emerald-500 w-5 text-center"></i> Housekeeping Certificate</li>
                      )}
                    </ul>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-lg font-bold text-slate-800">
                        Desired Salary: <span className="text-emerald-600">${employee.desiredSalary}/month</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
             <div className="mt-12">
                <button 
                  onClick={() => document.getElementById('root')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    Sign Up to Hire
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;