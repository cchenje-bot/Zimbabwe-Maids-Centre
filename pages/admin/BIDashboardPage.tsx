import React from 'react';
import { mockClients, mockEmployees, mockJobs } from '../../constants';
import { ApplicationStatus } from '../../types';

// Mock data and calculations for the dashboard
const userGrowth = { newClients: 35, newEmployees: 72 };
const hiringFunnel = { jobsPosted: 50, applications: 250, hires: 18 };
const platformHealth = { activeClients: mockClients.length, activeEmployees: mockEmployees.length };

const getTopLocations = (data: { location: string }[], count: number) => {
    const locationCounts = data.reduce((acc, item) => {
        const location = item.location.split(',')[0].trim(); // Get city name
        acc[location] = (acc[location] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, count);
};

const topJobLocations = getTopLocations(mockJobs, 5);
const topWorkerLocations = getTopLocations(mockEmployees, 5);


const BIDashboardPage: React.FC = () => {

    const clientEmployeeRatio = (platformHealth.activeEmployees / platformHealth.activeClients).toFixed(2);

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">Business Intelligence Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Growth */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><i className="fas fa-users text-blue-500"></i> User Growth (Last 30 Days)</h3>
                    <div className="flex justify-around text-center">
                        <div>
                            <p className="text-3xl font-bold text-blue-600">{userGrowth.newClients}</p>
                            <p className="text-slate-500">New Clients</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-emerald-600">{userGrowth.newEmployees}</p>
                            <p className="text-slate-500">New Employees</p>
                        </div>
                    </div>
                </div>

                {/* Platform Health */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><i className="fas fa-heartbeat text-red-500"></i> Platform Health</h3>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-slate-800">{platformHealth.activeClients} : {platformHealth.activeEmployees}</p>
                        <p className="text-slate-500 mb-2">Active Clients vs. Employees</p>
                        <p className="text-sm font-semibold text-red-700">~{clientEmployeeRatio} employees per client</p>
                    </div>
                </div>
            </div>

             {/* Hiring Funnel */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><i className="fas fa-filter text-purple-500"></i> Hiring Funnel (Last 30 Days)</h3>
                <div className="flex items-center justify-around text-center">
                    <div className="flex flex-col items-center">
                        <i className="fas fa-briefcase text-2xl text-slate-400 mb-1"></i>
                        <p className="text-2xl font-bold">{hiringFunnel.jobsPosted}</p>
                        <p className="text-slate-500 text-sm">Jobs Posted</p>
                    </div>
                    <i className="fas fa-arrow-right text-2xl text-slate-300 hidden md:block"></i>
                    <div className="flex flex-col items-center">
                        <i className="fas fa-file-alt text-2xl text-slate-400 mb-1"></i>
                        <p className="text-2xl font-bold">{hiringFunnel.applications}</p>
                        <p className="text-slate-500 text-sm">Applications</p>
                    </div>
                    <i className="fas fa-arrow-right text-2xl text-slate-300 hidden md:block"></i>
                    <div className="flex flex-col items-center">
                         <i className="fas fa-handshake text-2xl text-slate-400 mb-1"></i>
                        <p className="text-2xl font-bold text-emerald-600">{hiringFunnel.hires}</p>
                        <p className="text-slate-500 text-sm">Successful Hires</p>
                    </div>
                </div>
            </div>

            {/* Geographic Trends */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><i className="fas fa-map-marked-alt text-yellow-500"></i> Geographic Trends</h3>
                 <p className="text-sm text-slate-500 mb-4">A map visualization would provide deeper insights into regional supply and demand.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2">Top Job Locations</h4>
                        <ol className="list-decimal list-inside space-y-1 text-slate-700">
                            {topJobLocations.map(([location, count]) => (
                                <li key={location}>{location} <span className="text-xs text-slate-500">({count} jobs)</span></li>
                            ))}
                        </ol>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Top Worker Locations</h4>
                        <ol className="list-decimal list-inside space-y-1 text-slate-700">
                             {topWorkerLocations.map(([location, count]) => (
                                <li key={location}>{location} <span className="text-xs text-slate-500">({count} workers)</span></li>
                            ))}
                        </ol>
                    </div>
                 </div>
            </div>

        </div>
    );
};

export default BIDashboardPage;
