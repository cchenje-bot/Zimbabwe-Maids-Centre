import React from 'react';
import { EmployeeProfile } from '../types';

interface ProfileStrengthMeterProps {
    profile: EmployeeProfile;
}

const ProfileStrengthMeter: React.FC<ProfileStrengthMeterProps> = ({ profile }) => {
    const calculateStrength = () => {
        let score = 0;
        if (profile.bio.length > 50) score += 15;
        if (profile.skills.length > 0) score += 15;
        if (profile.certifications.length > 0) score += 15;
        if (profile.profilePictureUrl) score += 15;
        if (profile.reviews.length > 0) score += 15;
        if (profile.policeClearanceVerified) score += 5;
        if (profile.referenceChecked) score += 10;
        if (profile.medicalClearance) score += 10;
        return Math.min(score, 100); // Cap at 100
    };

    const strength = calculateStrength();
    const strengthColor = strength < 50 ? 'bg-yellow-500' : strength < 80 ? 'bg-blue-500' : 'bg-emerald-500';

    let strengthText = 'Needs Improvement';
    if (strength >= 100) strengthText = 'Excellent';
    else if (strength >= 80) strengthText = 'Strong';
    else if (strength >= 50) strengthText = 'Good';


    return (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-slate-700">Profile Strength</h4>
                <span className={`font-bold text-sm ${
                    strength < 50 ? 'text-yellow-600' : strength < 80 ? 'text-blue-600' : 'text-emerald-600'
                }`}>{strengthText}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                    className={`${strengthColor} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${strength}%` }}
                ></div>
            </div>
            {strength < 100 && <p className="text-xs text-slate-500 mt-2">Complete all verifications to maximize your visibility to clients.</p>}
        </div>
    );
};

export default ProfileStrengthMeter;