import React, { useState, useMemo } from 'react';
import { Review } from '../../types';
import StarRating from '../../components/StarRating';

interface ReviewModerationPageProps {
  reviews: Review[];
}

const AdminReviewModerationPage: React.FC<ReviewModerationPageProps> = ({ reviews: initialReviews }) => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);

    const handleReviewAction = (reviewId: number, newStatus: 'Approved' | 'Rejected') => {
        setReviews(currentReviews =>
            currentReviews.map(review =>
                review.id === reviewId ? { ...review, status: newStatus } : review
            )
        );
    };

    const pendingReviews = useMemo(() => {
        return reviews.filter(r => r.status === 'Pending');
    }, [reviews]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-1">Review Moderation Queue</h2>
            <p className="text-slate-500 mb-6">Approve or reject reviews that have been flagged by users or the system.</p>

            {pendingReviews.length > 0 ? (
                <div className="space-y-6">
                    {pendingReviews.map(review => (
                        <div key={review.id} className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                            <div className="flex flex-col md:flex-row justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-bold text-slate-800">{review.clientName}</p>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="text-sm text-slate-500">Submitted on: {review.date}</p>
                                    <p className="mt-2 text-slate-700 italic">"{review.comment}"</p>
                                </div>
                                <div className="mt-4 md:mt-0 flex gap-3 flex-shrink-0">
                                    <button
                                        onClick={() => handleReviewAction(review.id, 'Rejected')}
                                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
                                    >
                                        Reject
                                    </button>
                                     <button
                                        onClick={() => handleReviewAction(review.id, 'Approved')}
                                        className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <i className="fas fa-check-circle text-5xl text-emerald-400 mb-4"></i>
                    <h3 className="text-xl font-bold text-slate-700">All Clear!</h3>
                    <p className="text-slate-500 mt-2">There are no pending reviews in the moderation queue.</p>
                </div>
            )}
        </div>
    );
};

export default AdminReviewModerationPage;