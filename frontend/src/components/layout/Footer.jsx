// frontend/src/components/layout/Footer.jsx
import React from 'react';
import { Github, Zap } from 'lucide-react'; // Example icons

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-400 py-10"> {/* Changed background color */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-4">
          <a 
            href="https://github.com/Hack5-GitChai/documorph-ai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-slate-400 hover:text-brand-accent transition-colors mx-2"
          >
            <Github size={20} className="mr-1" /> GitHub
          </a>
          <span className="text-slate-500 mx-1">|</span>
          <a 
            href="https://vercel.com" // Replace if you have a Vercel specific link for your project
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-slate-400 hover:text-brand-accent transition-colors mx-2"
          >
            <Zap size={20} className="mr-1" /> Hosted on Vercel
          </a>
          {/* You could also add a link to Render for the backend */}
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} DocuMorph AI by 
          <a href="https://github.com/Hack5-GitChai" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-300 hover:text-brand-accent transition-colors">
             Hack5-GitChai
          </a>.
        </p>
        <p className="text-xs mt-2">
          {/* Placeholder for Privacy Policy & Terms links */}
          <a href="/privacy" className="hover:text-white mx-1">Privacy Policy</a>
          <span className="text-slate-500">·</span>
          <a href="/terms" className="hover:text-white mx-1">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;