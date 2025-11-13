import React, { useState } from 'react';

interface RateEmployerModalProps {
  clientName: string;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string }) => void;
}

const RateEmployerModal: React.FC<RateEmployerModalProps> = ({ clientName, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit({ rating, comment });
    } else {
      alert('Please select a rating.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-slate-800">Rate Your Experience</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <p className="text-slate-600 mb-6">
          Your feedback on working with <strong>{clientName}</strong> is confidential and helps us maintain a safe community.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 text-center">
            <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
            <div className="flex justify-center text-3xl text-slate-300">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    type="button"
                    key={starValue}
                    className={`px-1 ${starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-1">
              Private Comment (Optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Share details about your experience..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-6 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateEmployerModal;