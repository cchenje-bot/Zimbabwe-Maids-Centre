import React from 'react';

const AdminReportsPage: React.FC = () => {
    // Dummy data for charts
    const monthlyJobsData = [
        { month: 'Apr', count: 12 },
        { month: 'May', count: 18 },
        { month: 'Jun', count: 25 },
        { month: 'Jul', count: 22 },
    ];
    const maxCount = Math.max(...monthlyJobsData.map(d => d.count));

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <i className="fas fa-dollar-sign text-2xl text-emerald-500 mb-2"></i>
                    <p className="text-slate-500">Total Revenue (July)</p>
                    <p className="text-3xl font-bold">$1,280</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <i className="fas fa-user-plus text-2xl text-blue-500 mb-2"></i>
                    <p className="text-slate-500">New Users (July)</p>
                    <p className="text-3xl font-bold">42</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <i className="fas fa-check-circle text-2xl text-green-500 mb-2"></i>
                    <p className="text-slate-500">Successful Hires (July)</p>
                    <p className="text-3xl font-bold">18</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <i className="fas fa-star text-2xl text-yellow-500 mb-2"></i>
                    <p className="text-slate-500">Avg. Rating</p>
                    <p className="text-3xl font-bold">4.8</p>
                </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Jobs Posted Per Month</h3>
                <div className="flex items-end h-64 space-x-4 border-l border-b border-slate-200 pl-4 pb-4">
                    {monthlyJobsData.map(data => (
                        <div key={data.month} className="flex-1 flex flex-col items-center">
                             <span className="text-xs text-slate-500">{data.count}</span>
                            <div 
                                className="w-3/4 bg-emerald-500 rounded-t-md hover:bg-emerald-600"
                                style={{ height: `${(data.count / maxCount) * 90}%` }}
                                title={`${data.count} jobs`}
                            ></div>
                            <span className="text-sm font-semibold mt-2">{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;
