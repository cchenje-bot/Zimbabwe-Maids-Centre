import React from 'react';

interface FooterProps {
  onShowHelp: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowHelp }) => {
  return (
    <footer className="bg-slate-800 text-white mt-12">
      <div className="container mx-auto px-4 py-6 text-center">
         <div className="mb-4">
            <a onClick={onShowHelp} className="cursor-pointer hover:text-emerald-400">Help & Support</a>
            <span className="mx-2 text-slate-500">|</span>
            <a href="#" className="hover:text-emerald-400">Terms of Service</a>
            <span className="mx-2 text-slate-500">|</span>
            <a href="#" className="hover:text-emerald-400">Privacy Policy</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Zimbabwe Maids Centre. All Rights Reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="hover:text-emerald-400"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="hover:text-emerald-400"><i className="fab fa-twitter"></i></a>
          <a href="#" className="hover:text-emerald-400"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;