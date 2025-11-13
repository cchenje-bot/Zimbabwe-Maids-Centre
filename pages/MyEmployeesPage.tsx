import React from 'react';
import { EmployeeProfile } from '../types';
import StarRating from '../components/StarRating';

interface MyEmployeesPageProps {
  employees: EmployeeProfile[];
  onViewProfile: (employee: EmployeeProfile) => void;
  onStartChat: (employee: EmployeeProfile) => void;
}

const MyEmployeesPage: React.FC<MyEmployeesPageProps> = ({ employees, onViewProfile, onStartChat }) => {
  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold">My Employees</h2>
        <p className="text-slate-500 mt-1">Manage your hired staff, start conversations, and view their profiles.</p>
      </div>

      <div className="space-y-6">
        {employees.length > 0 ? (
          employees.map(employee => (
            <div key={employee.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img src={employee.profilePictureUrl} alt={employee.name} className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-800">{employee.name}</h3>
                  <p className="text-emerald-600 font-semibold">{employee.role}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                    <StarRating rating={employee.rating} />
                    <span className="text-slate-600 text-sm">({employee.rating.toFixed(1)})</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                  <button
                    onClick={() => onStartChat(employee)}
                    className="bg-white text-emerald-600 border-2 border-emerald-600 font-bold py-2 px-6 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-comment-dots"></i> Message
                  </button>
                  <button
                    onClick={() => onViewProfile(employee)}
                    className="bg-slate-100 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-user"></i> View Profile
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <i className="fas fa-users-slash text-5xl text-slate-300 mb-4"></i>
            <h3 className="text-xl font-bold text-slate-700">No Employees Hired</h3>
            <p className="text-slate-500 mt-2">Once you hire an employee, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEmployeesPage;
