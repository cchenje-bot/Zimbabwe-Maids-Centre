import React from 'react';
import { BadgeType } from '../types';

interface BadgeProps {
    badges: BadgeType[];
}

const badgeStyles: Record<BadgeType, { icon: string; color: string; text: string }> = {
    [BadgeType.TopRated]: {
        icon: 'fas fa-star',
        color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        text: 'Top Rated',
    },
    [BadgeType.FivePlusJobsCompleted]: {
        icon: 'fas fa-briefcase',
        color: 'bg-blue-100 text-blue-800 border border-blue-200',
        text: '5+ Jobs Completed',
    },
    [BadgeType.ReferralStar]: {
        icon: 'fas fa-gift',
        color: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        text: 'Referral Star',
    },
    [BadgeType.EliteWorker]: {
        icon: 'fas fa-gem',
        color: 'bg-purple-100 text-purple-800 border border-purple-200',
        text: 'Elite Worker',
    },
     [BadgeType.PremiumEmployee]: {
        icon: 'fas fa-crown',
        color: 'bg-amber-100 text-amber-800 border border-amber-200',
        text: 'Premium Employee',
    },
    [BadgeType.PoliceClearanceVerified]: {
        icon: 'fas fa-user-shield',
        color: 'bg-slate-200 text-slate-800 border border-slate-300',
        text: 'Police Clearance',
    },
    [BadgeType.ReferenceChecked]: {
        icon: 'fas fa-user-check',
        color: 'bg-sky-100 text-sky-800 border border-sky-200',
        text: 'Reference Checked',
    },
    [BadgeType.MedicalClearance]: {
        icon: 'fas fa-notes-medical',
        color: 'bg-pink-100 text-pink-800 border border-pink-200',
        text: 'Medical Clearance',
    }
};

const Badges: React.FC<BadgeProps> = ({ badges }) => {
    if (!badges || badges.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
            {badges.map((badge) => {
                const style = badgeStyles[badge];
                if (!style) return null;
                return (
                    <div
                        key={badge}
                        className={`group relative ${style.color} px-3 py-1 text-xs font-semibold rounded-full flex items-center`}
                    >
                        <i className={`${style.icon} mr-1.5`}></i> {style.text}
                    </div>
                );
            })}
        </div>
    );
};

export default Badges;