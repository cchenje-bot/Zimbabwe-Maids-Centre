import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Job, ApplicationStatus, Currency, Language } from '../types';
import { mockEmployees, mockClients, getCoordinatesForLocation, calculateDistance } from '../constants';
import ClientProfileView from './ClientProfileView';

const currentEmployee = mockEmployees[0];

interface JobDetailViewProps {
  job: Job;
  onBack: () => void;
  isSaved: boolean;
  onSaveToggle: () => void;
  applicationStatus: ApplicationStatus;
  onApply: () => void;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ job, onBack, isSaved, onSaveToggle, applicationStatus, onApply }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [viewingClientProfile, setViewingClientProfile] = useState(false);

  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginalDescription, setShowOriginalDescription] = useState(true);

  // Assuming job descriptions are in English
  const needsTranslation = currentEmployee.preferredLanguage !== Language.English;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const client = mockClients.find(c => c.id === job.clientId);
  
  const employeeCoords = getCoordinatesForLocation(currentEmployee.location);
  const jobCoords = getCoordinatesForLocation(job.location);
  const distance = employeeCoords && jobCoords ? calculateDistance(employeeCoords, jobCoords) : null;


  const handleConfirmApply = () => {
    onApply();
    setShowApplyModal(false);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (showApplyModal && event.key === 'Escape') {
          setShowApplyModal(false);
       }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
        window.removeEventListener('keydown', handleEsc);
    };
  }, [showApplyModal]);

  const handleTranslateDescription = async () => {
    if (!needsTranslation || translatedDescription) return;
    setIsTranslating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Translate the following text to ${currentEmployee.preferredLanguage}: "${job.description}"`,
      });
      setTranslatedDescription(response.text);
      setShowOriginalDescription(false);
    } catch (error) {
      console.error("Description translation failed:", error);
      setTranslatedDescription("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };


  const hasApplied = applicationStatus !== ApplicationStatus.NotApplied;

  const getCurrencySymbol = (currency: Currency) => {
    switch (currency) {
      case Currency.USD: return '$';
      case Currency.ZAR: return 'R';
      case Currency.RTGS: return 'Z$';
      default: return '$';
    }
  }

  if (viewingClientProfile && client) {
    return <ClientProfileView client={client} onBack={() => setViewingClientProfile(false)} />;
  }
  
  const hasSpecifics = job.numberOfRooms || (job.duties && job.duties.length > 0) || job.numberOfKids !== undefined;


  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 text-emerald-600 hover:text-emerald-800 font-semibold">
          <i className="fas fa-arrow-left mr-2"></i> Back to Jobs
        </button>
        
        <div className="border-b-2 border-slate-200 pb-4 mb-4">
          <span className="text-xs font-semibold uppercase text-emerald-600 bg-emerald-100 px-2 py-1 rounded">{job.category}</span>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">{job.title}</h2>
           <p className="text-slate-500 mt-1">
            Posted by <button onClick={() => setViewingClientProfile(true)} className="font-semibold text-emerald-600 hover:underline">{job.clientName}</button> on {job.postedDate}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg text-center">
              <i className="fas fa-map-marker-alt text-2xl text-emerald-600 mb-2"></i>
              <h4 className="font-bold">Location</h4>
              <p className="text-slate-600">{job.location}</p>
              {distance !== null && <p className="text-sm text-blue-600 font-semibold mt-1">(~{distance.toLocaleString()} km from you)</p>}
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
              <i className="fas fa-money-bill-wave text-2xl text-emerald-600 mb-2"></i>
              <h4 className="font-bold">Salary</h4>
              <p className="text-slate-600">
                {getCurrencySymbol(job.currency)}
                {job.hourlyRate ? `${job.hourlyRate.toLocaleString()}/hr` : job.salary.toLocaleString()} 
                <span className="text-xs"> {job.currency}</span>
              </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
              <i className="fas fa-clock text-2xl text-emerald-600 mb-2"></i>
              <h4 className="font-bold">Duration</h4>
              <p className="text-slate-600">{job.duration}</p>
          </div>
        </div>

        {hasSpecifics && (
            <div className="mb-6">
                <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Job Specifics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-slate-700">
                    {job.numberOfRooms && (
                        <div className="flex items-center gap-3">
                            <i className="fas fa-door-open text-emerald-500 w-5 text-center"></i>
                            <span><strong>Rooms:</strong> {job.numberOfRooms}</span>
                        </div>
                    )}
                    {job.numberOfKids !== undefined && (
                        <div className="flex items-center gap-3">
                            <i className="fas fa-child text-emerald-500 w-5 text-center"></i>
                            <span><strong>Kids:</strong> {job.numberOfKids}</span>
                        </div>
                    )}
                    {job.agesOfKids && (
                        <div className="flex items-center gap-3">
                            <i className="fas fa-birthday-cake text-emerald-500 w-5 text-center"></i>
                            <span><strong>Ages:</strong> {job.agesOfKids}</span>
                        </div>
                    )}
                </div>
                {job.duties && job.duties.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Duties Include:</h4>
                        <div className="flex flex-wrap gap-2">
                            {job.duties.map(duty => (
                                <span key={duty} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">{duty}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold">Job Description</h3>
            {needsTranslation && (
              <button 
                onClick={translatedDescription ? () => setShowOriginalDescription(!showOriginalDescription) : handleTranslateDescription}
                disabled={isTranslating}
                className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm flex items-center gap-2 py-1 px-3 rounded-md hover:bg-emerald-50 transition-colors disabled:opacity-50"
              >
                {isTranslating ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-language"></i>
                )}
                <span>
                  {isTranslating 
                    ? 'Translating...' 
                    : translatedDescription 
                      ? (showOriginalDescription ? 'Show Translation' : 'Show Original') 
                      : `Translate to ${currentEmployee.preferredLanguage}`
                  }
                </span>
              </button>
            )}
          </div>
          {showOriginalDescription ? (
            <p className="text-slate-600 leading-relaxed">{job.description}</p>
          ) : (
            <p className="text-slate-600 leading-relaxed italic">{translatedDescription}</p>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => setShowApplyModal(true)}
            disabled={hasApplied}
            className="w-full sm:w-auto bg-emerald-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-emerald-700 transition-colors text-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {hasApplied ? <><i className="fas fa-check-circle"></i> {applicationStatus}</> : 'Apply Now'}
          </button>
          <button
            onClick={onSaveToggle}
            className={`w-full sm:w-auto font-bold py-3 px-8 rounded-lg transition-colors text-lg flex items-center justify-center gap-2 ${
              isSaved
                ? 'bg-emerald-100 text-emerald-800'
                : 'border-2 border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i>
            {isSaved ? 'Job Saved' : 'Save Job'}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black flex justify-center items-center z-50 transition-opacity duration-300 ${showApplyModal ? 'bg-opacity-60' : 'bg-opacity-0 pointer-events-none'}`}
        aria-hidden={!showApplyModal}
      >
        <div 
          className={`bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center transform transition-all duration-300 ${showApplyModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <h3 id="modal-title" className="text-2xl font-bold mb-4 text-slate-800">Confirm Application</h3>
          <p className="text-slate-600 mb-8">
            Are you sure you want to apply for the position of <strong>{job.title}</strong>?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowApplyModal(false)}
              className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmApply}
              className="py-2 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors"
            >
              Yes, Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetailView;
