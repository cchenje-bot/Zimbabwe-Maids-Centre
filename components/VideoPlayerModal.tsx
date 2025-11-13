import React, { useEffect, useRef } from 'react';

interface VideoPlayerModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoUrl, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="relative bg-black rounded-lg shadow-xl w-full max-w-3xl" ref={modalRef}>
         <button 
          onClick={onClose} 
          className="absolute -top-4 -right-4 bg-white text-slate-800 rounded-full h-10 w-10 flex items-center justify-center shadow-lg hover:bg-slate-200 transition-transform hover:scale-110 z-20"
          aria-label="Close video player"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        <video
          className="w-full h-auto rounded-lg"
          src={videoUrl}
          controls
          autoPlay
          onEnded={onClose}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayerModal;