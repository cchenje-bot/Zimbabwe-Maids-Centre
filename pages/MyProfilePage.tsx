import React, { useState, useRef, useEffect } from 'react';
import { mockEmployees } from '../constants';
import { EmployeeProfile, AvailabilityStatus, BadgeType } from '../types';
import StarRating from '../components/StarRating';
import ProfileStrengthMeter from '../components/ProfileStrengthMeter';
import Badges from '../components/Badges';
import VideoPlayerModal from '../components/VideoPlayerModal';

// For demonstration, we'll assume the logged-in employee is the first one.
// In a real app, this would come from an auth context.
const currentEmployee = mockEmployees[0];

interface MyProfilePageProps {
  onBack: () => void;
}

const MyProfilePage: React.FC<MyProfilePageProps> = ({ onBack }) => {
  const [profile, setProfile] = useState<EmployeeProfile>(currentEmployee);
  const [isEditing, setIsEditing] = useState(false);
  const [editableBio, setEditableBio] = useState(profile.bio);

  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [editableAvailability, setEditableAvailability] = useState<AvailabilityStatus>(profile.availability);
  
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);
  const [editableSkills, setEditableSkills] = useState(profile.skills.join(', '));
  const [editableSalary, setEditableSalary] = useState(profile.desiredSalary.toString());
  const [editableOffDays, setEditableOffDays] = useState((profile.desiredOffDays || 4).toString());


  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editableDetails, setEditableDetails] = useState({
    age: profile.age.toString(),
    religion: profile.religion,
    experience: profile.experience.toString(),
    location: profile.location,
  });


  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pictureInputRef = useRef<HTMLInputElement>(null);


  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);

  const isPremium = profile.badges.includes(BadgeType.PremiumEmployee);
  const employeeFee = isPremium ? 100 : 30;

  useEffect(() => {
    if (isEditing) {
      bioTextareaRef.current?.focus();
    }
  }, [isEditing]);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsSave = () => {
    setProfile(prev => ({
      ...prev,
      age: Number(editableDetails.age) || prev.age,
      religion: editableDetails.religion,
      experience: Number(editableDetails.experience) || prev.experience,
      location: editableDetails.location,
    }));
    setIsEditingDetails(false);
  };

  const handleDetailsCancel = () => {
    setEditableDetails({
      age: profile.age.toString(),
      religion: profile.religion,
      experience: profile.experience.toString(),
      location: profile.location,
    });
    setIsEditingDetails(false);
  };

  const handleSave = () => {
    // Here you would make an API call to save the changes
    setProfile(prev => ({ ...prev, bio: editableBio }));
    setIsEditing(false);
    // You could show a success toast/notification here
  };
  
  const handleCancel = () => {
    setEditableBio(profile.bio); // Reset changes
    setIsEditing(false);
  };

  const handleAvailabilitySave = () => {
    setProfile(prev => ({ ...prev, availability: editableAvailability }));
    setIsEditingAvailability(false);
  };
  
  const handleAvailabilityCancel = () => {
    setEditableAvailability(profile.availability);
    setIsEditingAvailability(false);
  };
  
  const handlePrefsSave = () => {
    // In a real app, you would make an API call to save the changes
    setProfile(prev => ({
        ...prev,
        skills: editableSkills.split(',').map(s => s.trim()).filter(s => s),
        desiredSalary: Number(editableSalary) || 0,
        desiredOffDays: Number(editableOffDays) || 0,
    }));
    setIsEditingPrefs(false);
  };

  const handlePrefsCancel = () => {
      setEditableSkills(profile.skills.join(', '));
      setEditableSalary(profile.desiredSalary.toString());
      setEditableOffDays((profile.desiredOffDays || 4).toString());
      setIsEditingPrefs(false);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a service like S3 or Firebase Storage
      // and get a URL back to save in the user's profile.
      console.log('Simulating video upload:', file.name);
      // For this demo, we'll just create a blob URL to simulate the upload.
      const videoUrl = URL.createObjectURL(file);
      setProfile(prev => ({...prev, videoIntroductionUrl: videoUrl }));
      alert('Video uploaded successfully! (Demo)');
    }
  };

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newPictureUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, profilePictureUrl: newPictureUrl }));
      // In a real app, you would upload this file and get a new URL.
    }
  };


  return (
    <>
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>
        <button onClick={onBack} className="text-emerald-600 hover:text-emerald-800 font-semibold">
          <i className="fas fa-times mr-2"></i> Close
        </button>
      </div>
      
      <ProfileStrengthMeter profile={profile} />

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 text-center">
           <div className="relative w-48 h-48 mx-auto">
            <img src={profile.profilePictureUrl} alt={profile.name} className="w-48 h-48 rounded-full object-cover border-4 border-emerald-200" />
            <input
              type="file"
              ref={pictureInputRef}
              onChange={handlePictureChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => pictureInputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-slate-700 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg hover:bg-slate-800 transition-transform hover:scale-110"
              aria-label="Change profile picture"
            >
              <i className="fas fa-camera"></i>
            </button>
          </div>
          <h2 className="text-3xl font-bold mt-4">{profile.name}</h2>
          <p className="text-xl text-emerald-600 font-semibold">{profile.role}</p>
          <Badges badges={profile.badges} />
          <div className="flex items-center justify-center text-slate-500 mt-4">
            <i className="fas fa-map-marker-alt mr-2"></i> {profile.location}
          </div>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <StarRating rating={profile.rating} />
            <span className="text-slate-600 font-bold">({profile.rating.toFixed(1)})</span>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="mb-6">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2 mb-3">
                <h3 className="text-xl font-bold">Personal Details</h3>
                {!isEditingDetails ? (
                    <button onClick={() => setIsEditingDetails(true)} className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-2 py-1 px-3 rounded-md hover:bg-emerald-50 transition-colors">
                        <i className="fas fa-pencil-alt text-sm"></i> Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handleDetailsSave} className="bg-emerald-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-emerald-700 transition-colors">Save</button>
                        <button onClick={handleDetailsCancel} className="bg-slate-200 text-slate-700 font-semibold py-1 px-4 rounded-lg hover:bg-slate-300">Cancel</button>
                    </div>
                )}
            </div>
            {isEditingDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                        <input type="number" name="age" id="age" value={editableDetails.age} onChange={handleDetailsChange} className="w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="religion" className="block text-sm font-medium text-slate-700 mb-1">Religion</label>
                        <input type="text" name="religion" id="religion" value={editableDetails.religion} onChange={handleDetailsChange} className="w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
                        <input type="number" name="experience" id="experience" value={editableDetails.experience} onChange={handleDetailsChange} className="w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input type="text" name="location" id="location" value={editableDetails.location} onChange={handleDetailsChange} className="w-full p-2 border border-slate-300 rounded-md" />
                    </div>
                </div>
            ) : (
                <div className="space-y-3 text-slate-700">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-birthday-cake text-emerald-500 w-5 text-center"></i> <span>{profile.age} years old</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <i className="fas fa-pray text-emerald-500 w-5 text-center"></i> <span>{profile.religion}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <i className="fas fa-briefcase text-emerald-500 w-5 text-center"></i> <span>{profile.experience} years experience</span>
                    </div>
                </div>
            )}
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2 mb-3">
                <h3 className="text-xl font-bold">About Me</h3>
                {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-2 py-1 px-3 rounded-md hover:bg-emerald-50 transition-colors">
                    <i className="fas fa-pencil-alt text-sm"></i> Edit
                </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-emerald-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-emerald-700 transition-colors">Save</button>
                        <button onClick={handleCancel} className="bg-slate-200 text-slate-700 font-semibold py-1 px-4 rounded-lg hover:bg-slate-300">Cancel</button>
                    </div>
                )}
            </div>
             {isEditing ? (
                <textarea
                ref={bioTextareaRef}
                value={editableBio}
                onChange={(e) => setEditableBio(e.target.value)}
                className="w-full h-40 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="Tell clients about yourself..."
                />
            ) : (
                <p className="text-slate-600 whitespace-pre-wrap">{profile.bio}</p>
            )}
          </div>
          
           <div className="mb-6">
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Video Introduction</h3>
              <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                {profile.videoIntroductionUrl ? (
                  <div className="flex items-center gap-4">
                    <i className="fas fa-video text-2xl text-emerald-600"></i>
                    <div>
                      <p className="font-semibold text-slate-800">Your video is ready.</p>
                      <button onClick={() => setShowVideoModal(true)} className="text-sm text-emerald-600 hover:underline">Watch Video</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600">No video uploaded yet.</p>
                )}
                 <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoUpload}
                  className="hidden"
                  accept="video/*"
                />
                <button onClick={() => videoInputRef.current?.click()} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                  {profile.videoIntroductionUrl ? 'Change Video' : 'Upload Video'}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Verifications</h3>
              <div className="space-y-3 text-slate-700">
                  <div className="flex items-center gap-3">
                      <i className={`fas fa-check-circle w-5 text-center ${profile.verified ? 'text-emerald-500' : 'text-slate-400'}`}></i>
                      <span>Profile Verification:</span>
                      <span className={`font-bold ${profile.verified ? 'text-emerald-700' : 'text-slate-500'}`}>{profile.verified ? 'Completed' : 'Pending'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <i className={`fas fa-shield-alt w-5 text-center ${profile.backgroundChecked ? 'text-blue-500' : 'text-slate-400'}`}></i>
                      <span>Background Check:</span>
                      <span className={`font-bold ${profile.backgroundChecked ? 'text-blue-700' : 'text-slate-500'}`}>{profile.backgroundChecked ? 'Completed' : 'Not Submitted'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <i className={`fas fa-user-shield w-5 text-center ${profile.policeClearanceVerified ? 'text-slate-600' : 'text-slate-400'}`}></i>
                      <span>Police Clearance:</span>
                      <span className={`font-bold ${profile.policeClearanceVerified ? 'text-slate-700' : 'text-slate-500'}`}>{profile.policeClearanceVerified ? 'Completed' : 'Not Submitted'}</span>
                  </div>
                   <div className="flex items-center gap-3">
                      <i className={`fas fa-user-check w-5 text-center ${profile.referenceChecked ? 'text-sky-500' : 'text-slate-400'}`}></i>
                      <span>Reference Check:</span>
                      <span className={`font-bold ${profile.referenceChecked ? 'text-sky-700' : 'text-slate-500'}`}>{profile.referenceChecked ? 'Completed' : 'Not Submitted'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <i className={`fas fa-notes-medical w-5 text-center ${profile.medicalClearance ? 'text-pink-500' : 'text-slate-400'}`}></i>
                      <span>Medical Clearance:</span>
                      <span className={`font-bold ${profile.medicalClearance ? 'text-pink-700' : 'text-slate-500'}`}>{profile.medicalClearance ? 'Completed' : 'Not Submitted'}</span>
                  </div>
              </div>
            </div>
            
            <div className="mb-6">
                <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Placement Fee</h3>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-slate-700">Your one-time placement fee:</p>
                        <p className="text-lg font-bold text-emerald-600">${employeeFee} USD</p>
                    </div>
                    <i className="fas fa-info-circle text-2xl text-slate-400" title="This fee is deducted upon successful job placement."></i>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This fee is due upon successful placement. To pay, please use one of our payment methods and then send proof of payment to our WhatsApp number to get a confirmation code. See the Help section for more details.
                </p>
            </div>

          <div className="mb-6">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2 mb-3">
              <h3 className="text-xl font-bold">Availability</h3>
              {!isEditingAvailability ? (
                <button onClick={() => setIsEditingAvailability(true)} className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-2 py-1 px-3 rounded-md hover:bg-emerald-50 transition-colors">
                  <i className="fas fa-pencil-alt text-sm"></i> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleAvailabilitySave} className="bg-emerald-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-emerald-700 transition-colors">Save</button>
                  <button onClick={handleAvailabilityCancel} className="bg-slate-200 text-slate-700 font-semibold py-1 px-4 rounded-lg hover:bg-slate-300">Cancel</button>
                </div>
              )}
            </div>
            {isEditingAvailability ? (
              <select
                value={editableAvailability}
                onChange={(e) => setEditableAvailability(e.target.value as AvailabilityStatus)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 transition"
              >
                {Object.values(AvailabilityStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            ) : (
              <p className="text-slate-600 font-medium">{profile.availability}</p>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center border-b-2 border-slate-200 pb-2 mb-3">
                <h3 className="text-xl font-bold">Work Preferences</h3>
                {!isEditingPrefs ? (
                    <button onClick={() => setIsEditingPrefs(true)} className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-2 py-1 px-3 rounded-md hover:bg-emerald-50 transition-colors">
                        <i className="fas fa-pencil-alt text-sm"></i> Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handlePrefsSave} className="bg-emerald-600 text-white font-bold py-1 px-4 rounded-lg hover:bg-emerald-700 transition-colors">Save</button>
                        <button onClick={handlePrefsCancel} className="bg-slate-200 text-slate-700 font-semibold py-1 px-4 rounded-lg hover:bg-slate-300">Cancel</button>
                    </div>
                )}
            </div>
            {isEditingPrefs ? (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-1">Skills (comma-separated)</label>
                        <input
                            type="text"
                            id="skills"
                            value={editableSkills}
                            onChange={(e) => setEditableSkills(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 transition"
                            placeholder="e.g., Deep Cleaning, Laundry, Ironing"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="desiredSalary" className="block text-sm font-medium text-slate-700 mb-1">Preferred Minimum Salary (USD per month)</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="desiredSalary"
                                    value={editableSalary}
                                    onChange={(e) => setEditableSalary(e.target.value)}
                                    className="w-full p-2 pl-7 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 transition"
                                    placeholder="350"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="desiredOffDays" className="block text-sm font-medium text-slate-700 mb-1">Desired Off Days / Month</label>
                            <input
                                type="number"
                                id="desiredOffDays"
                                value={editableOffDays}
                                onChange={(e) => setEditableOffDays(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 transition"
                                placeholder="e.g., 4"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-slate-700">Skills</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {profile.skills.length > 0 ? profile.skills.map(skill => (
                                <span key={skill} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">{skill}</span>
                            )) : <p className="text-slate-500">No skills listed.</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-slate-700">Preferred Minimum Salary</h4>
                            <p className="text-lg font-bold text-emerald-600">${profile.desiredSalary} / month</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-700">Desired Off Days / Month</h4>
                            <p className="text-lg font-bold text-emerald-600">{profile.desiredOffDays} days</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Certifications</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                {profile.certifications.length > 0 ? profile.certifications.map(cert => <li key={cert}>{cert}</li>) : <li>No certifications listed.</li>}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold border-b-2 border-slate-200 pb-2 mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map(lang => (
                  <span key={lang} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm">{lang}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showVideoModal && profile.videoIntroductionUrl && (
      <VideoPlayerModal
        videoUrl={profile.videoIntroductionUrl}
        onClose={() => setShowVideoModal(false)}
      />
    )}
    </>
  );
};

export default MyProfilePage;