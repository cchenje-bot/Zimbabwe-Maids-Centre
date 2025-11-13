import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { EmployeeProfile, BadgeType } from '../types';
import StarRating from '../components/StarRating';
import { mockClient, getCoordinatesForLocation, calculateDistance } from '../constants';
import Badges from '../components/Badges';
import VideoPlayerModal from '../components/VideoPlayerModal';
import PaymentModal from '../components/PaymentModal';

interface EmployeeProfileViewProps {
  employee: EmployeeProfile;
  onBack: () => void;
  onStartChat: (employee: EmployeeProfile) => void;
  onHireEmployee: (employee: EmployeeProfile, hireType: 'long-term' | 'once-off') => void;
  hiredEmployeeIds: number[];
}

const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({ employee, onBack, onStartChat, onHireEmployee, hiredEmployeeIds }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const isAlreadyHired = hiredEmployeeIds.includes(employee.id);

  const [translatedBio, setTranslatedBio] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginalBio, setShowOriginalBio] = useState(true);

  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const needsTranslation = employee.preferredLanguage !== mockClient.preferredLanguage;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const isPremium = employee.badges.includes(BadgeType.PremiumEmployee);
  const clientFee = isPremium ? 120 : 40;
  
  const clientCoords = getCoordinatesForLocation(mockClient.location);
  const employeeCoords = getCoordinatesForLocation(employee.location);
  const distance = clientCoords && employeeCoords ? calculateDistance(clientCoords, employeeCoords) : null;

  const handleTranslateBio = async () => {
    if (!needsTranslation || translatedBio) return;
    setIsTranslating(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Translate the following text to ${mockClient.preferredLanguage}: "${employee.bio}"`,
      });
      setTranslatedBio(response.text);
      setShowOriginalBio(false);
    } catch (error) {
      console.error("Bio translation failed:", error);
      setTranslatedBio("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setInterviewQuestions([]);
    setShowQuestionsModal(true);

    const prompt = `You are a helpful assistant for someone looking to hire domestic staff. Generate 5 insightful interview questions for a candidate applying for the role of '${employee.role}'. The candidate has listed the following skills: ${employee.skills.join(', ')}. The questions should be practical and help assess their experience, reliability, and problem-solving abilities. Return the questions as a JSON object with a single key "questions" which is an array of strings.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            description: 'A list of 5 interview questions.',
                            items: {
                                type: Type.STRING,
                            }
                        }
                    },
                    required: ['questions'],
                }
            }
        });
        
        const result = JSON.parse(response.text);
        if (result.questions && result.questions.length > 0) {
            setInterviewQuestions(result.questions);
        } else {
             setGenerationError("Sorry, we couldn't generate relevant questions. Please try again.");
        }

    } catch (error) {
        console.error("Failed to generate interview questions:", error);
        setGenerationError("Sorry, we couldn't generate questions at this time. Please try again later.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleCopyQuestions = () => {
    const textToCopy = interviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };


  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 text-emerald-600 hover:text-emerald-800 font-semibold">
          <i className="fas fa-arrow-left mr-2"></i> Back to Profiles
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 text-center">
            <div className="relative w-48 h-48 mx-auto">
              <img src={employee.profilePictureUrl} alt={employee.name} className="w-48 h-48 rounded-full object-cover border-4 border-emerald-200" />
               {employee.videoIntroductionUrl && (
                  <button onClick={() => setShowVideoModal(true)} className="absolute bottom-2 right-2 bg-emerald-600 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-transform hover:scale-110">
                      <i className="fas fa-play text-lg"></i>
                  </button>
              )}
            </div>
            <h2 className="text-3xl font-bold mt-4">{employee.name}</h2>
            <p className="text-xl text-emerald-600 font-semibold">{employee.role}</p>
            <Badges badges={employee.badges} />
            <div className="flex items-center justify-center text-slate-500 mt-4">
              <i className="fas fa-map-marker-alt mr-2"></i> {employee.location}
              {distance !== null && <span className="ml-2 text-blue-600 font-semibold">(~{distance.toLocaleString()} km from client)</span>}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {employee.verified && (
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold rounded-full flex items-center">
                  <i className="fas fa-check-circle mr-2"></i> Verified
                </span>
              )}
              {employee.backgroundChecked && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 text-xs font-semibold rounded-full flex items-center">
                  <i className="fas fa-shield-alt mr-2"></i> Background Checked
                </span>
              )}
               {employee.policeClearanceVerified && (
                <span className="bg-slate-100 text-slate-800 px-3 py-1 text-xs font-semibold rounded-full flex items-center">
                  <i className="fas fa-user-shield mr-2"></i> Police Clearance
                </span>
              )}
               {employee.referenceChecked && (
                <span className="bg-sky-100 text-sky-800 px-3 py-1 text-xs font-semibold rounded-full flex items-center">
                  <i className="fas fa-user-check mr-2"></i> Reference Checked
                </span>
              )}
              {employee.medicalClearance && (
                <span className="bg-pink-100 text-pink-800 px-3 py-1 text-xs font-semibold rounded-full flex items-center">
                  <i className="fas fa-notes-medical mr-2"></i> Medical Clearance
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <StarRating rating={employee.rating} />
              <span className="text-slate-600 font-bold">({employee.rating.toFixed(1)})</span>
            </div>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => onHireEmployee(employee, 'long-term')}
                disabled={isAlreadyHired}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAlreadyHired ? (
                  <>
                    <i className="fas fa-check-circle mr-2"></i> Hired
                  </>
                ) : (
                  `Hire (Long-Term)`
                )}
              </button>
               {['Cleaner', 'Gardener', 'Maid', 'Baby Minder'].includes(employee.role) && (
                <button
                  onClick={() => onHireEmployee(employee, 'once-off')}
                  disabled={isAlreadyHired}
                  className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  Once-off Hire ($20 Fee)
                </button>
              )}
              <button
                onClick={() => onStartChat(employee)}
                className="w-full bg-white text-emerald-600 border-2 border-emerald-600 font-bold py-3 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center"
              >
                <i className="fas fa-comment-dots mr-2"></i> Message
              </button>
              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="w-full bg-slate-100 text-slate-700 border-2 border-slate-200 font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <i className="fas fa-lightbulb mr-2"></i> Generate Interview Questions
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="mb-6">
              <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2 mb-3">
                <h3 className="text-xl font-bold">About Me</h3>
                {needsTranslation && (
                  <button 
                    onClick={translatedBio ? () => setShowOriginalBio(!showOriginalBio) : handleTranslateBio}
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
                        : translatedBio 
                          ? (showOriginalBio ? 'Show Translation' : 'Show Original') 
                          : `Translate to ${mockClient.preferredLanguage}`
                      }
                    </span>
                  </button>
                )}
              </div>
              {showOriginalBio ? (
                 <p className="text-slate-600">{employee.bio}</p>
              ) : (
                 <p className="text-slate-600 italic">{translatedBio}</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-slate-700">
                <div className="flex items-center gap-3">
                  <i className="fas fa-birthday-cake text-emerald-500 w-5 text-center"></i>
                  <span><strong>Age:</strong> {employee.age} years</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-pray text-emerald-500 w-5 text-center"></i>
                  <span><strong>Religion:</strong> {employee.religion}</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-briefcase text-emerald-500 w-5 text-center"></i>
                  <span><strong>Experience:</strong> {employee.experience} years</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-language text-emerald-500 w-5 text-center"></i>
                  <span><strong>Languages:</strong> {employee.languages.join(', ')}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map(skill => (
                  <span key={skill} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
                <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Certifications</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {employee.certifications.length > 0 ? employee.certifications.map(cert => <li key={cert}>{cert}</li>) : <li>No certifications listed.</li>}
                </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Work Preferences</h3>
              <div className="bg-slate-50 p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                      <p className="font-semibold text-slate-700">Preferred Minimum Salary:</p>
                      <p className="text-lg font-bold text-emerald-600">${employee.desiredSalary} / month</p>
                  </div>
                  <div>
                      <p className="font-semibold text-slate-700">Desired Off Days / Month:</p>
                      <p className="text-lg font-bold text-emerald-600">{employee.desiredOffDays} days</p>
                  </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Reviews ({employee.reviews.length})</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {employee.reviews.length > 0 ? employee.reviews.map(review => (
                  <div key={review.id} className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{review.clientName}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-slate-600 mt-2 italic">"{review.comment}"</p>
                    <p className="text-right text-xs text-slate-400 mt-2">{review.date}</p>
                  </div>
                )) : <p className="text-slate-500">No reviews yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          employeeName={employee.name}
          fee={clientFee}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={() => {
            onHireEmployee(employee, 'long-term');
            setShowPaymentModal(false);
          }}
        />
      )}

      {showQuestionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-slate-800">Suggested Interview Questions</h3>
              <button onClick={() => setShowQuestionsModal(false)} className="text-slate-500 hover:text-slate-800">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            {isGenerating ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-emerald-500"></i>
                <p className="mt-4 text-slate-600">Generating questions...</p>
              </div>
            ) : generationError ? (
              <div className="text-red-600 bg-red-50 p-4 rounded-md">
                <p><strong>Error:</strong> {generationError}</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-600 mb-4">Here are some questions to help you assess <strong>{employee.name}</strong>'s suitability for the role of {employee.role}.</p>
                <ul className="space-y-3 list-decimal list-inside text-slate-700 bg-slate-50 p-4 rounded-md">
                  {interviewQuestions.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                    <button
                        onClick={handleCopyQuestions}
                        className="py-2 px-4 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
                    >
                        {copyStatus === 'idle' ? (
                            <><i className="fas fa-copy mr-2"></i> Copy</>
                        ) : (
                            <><i className="fas fa-check mr-2"></i> Copied!</>
                        )}
                    </button>
                    <button
                        onClick={() => setShowQuestionsModal(false)}
                        className="py-2 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors"
                    >
                        Close
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showVideoModal && employee.videoIntroductionUrl && (
        <VideoPlayerModal 
            videoUrl={employee.videoIntroductionUrl}
            onClose={() => setShowVideoModal(false)}
        />
      )}
    </>
  );
};

export default EmployeeProfileView;