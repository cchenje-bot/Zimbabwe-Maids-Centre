import React, { useState } from 'react';
import { Job, ApplicationStatus, EmployerReview } from '../types';
import { mockJobs } from '../constants';
import RateEmployerModal from '../components/RateEmployerModal';

interface MyApplicationsPageProps {
  applications: Map<number, ApplicationStatus>;
  onJobClick: (job: Job) => void;
}

const MyApplicationsPage: React.FC<MyApplicationsPageProps> = ({ applications, onJobClick }) => {
    const [ratingJob, setRatingJob] = useState<Job | null>(null);

    const appliedJobs = mockJobs.filter(job => applications.has(job.id));

    const handleRatingSubmit = (review: Omit<EmployerReview, 'employeeId' | 'jobId'>) => {
        if (!ratingJob) return;
        // In a real app, you would submit this to your backend for admin review.
        console.log({
            message: "Private employer review submitted for admin use.",
            jobId: ratingJob.id,
            clientName: ratingJob.clientName,
            rating: review.rating,
            comment: review.comment
        });
        alert('Thank you! Your feedback has been submitted privately.');
        setRatingJob(null);
    };


    const getStatusChipStyle = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.Applied:
                return 'bg-blue-100 text-blue-800';
            case ApplicationStatus.Viewed:
                return 'bg-indigo-100 text-indigo-800';
            case ApplicationStatus.Interviewing:
                return 'bg-purple-100 text-purple-800';
            case ApplicationStatus.Offered:
                return 'bg-green-100 text-green-800';
             case ApplicationStatus.Rejected:
                return 'bg-red-100 text-red-800';
            case ApplicationStatus.Completed:
                return 'bg-emerald-100 text-emerald-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold">My Applications</h2>
        <p className="text-slate-500 mt-1">Track the status of your job applications.</p>
      </div>

      <div className="space-y-6">
        {appliedJobs.length > 0 ? (
          appliedJobs.map(job => {
            const status = applications.get(job.id)!;
            return (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                        <div className="cursor-pointer flex-grow" onClick={() => onJobClick(job)}>
                            <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                            <p className="text-slate-500 mt-1">Applied to {job.clientName}</p>
                            <div className="flex items-center text-slate-500 my-2 text-sm">
                                <span><i className="fas fa-map-marker-alt mr-2"></i>{job.location}</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right flex-shrink-0">
                             <span className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusChipStyle(status)}`}>
                                {status}
                            </span>
                        </div>
                    </div>
                    {status === ApplicationStatus.Completed && (
                        <div className="mt-4 pt-4 border-t border-slate-200 text-right">
                            <button onClick={() => setRatingJob(job)} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors text-sm">
                                <i className="fas fa-star-half-alt mr-2"></i> Rate Employer
                            </button>
                        </div>
                    )}
                </div>
            )
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <i className="far fa-file-alt text-5xl text-slate-300 mb-4"></i>
            <h3 className="text-xl font-bold text-slate-700">No Applications Yet</h3>
            <p className="text-slate-500 mt-2">When you apply for a job, you can track its status here.</p>
          </div>
        )}
      </div>

       {ratingJob && (
        <RateEmployerModal
          clientName={ratingJob.clientName}
          onClose={() => setRatingJob(null)}
          onSubmit={handleRatingSubmit}
        />
      )}
    </>
  );
};

export default MyApplicationsPage;