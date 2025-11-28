import React from 'react';
import { Aperture } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Aperture className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">FocusAI</h1>
            <p className="text-xs text-slate-400 font-medium">Cinematic Depth Engine</p>
          </div>
        </div>
        
        <a 
          href="https://ai.google.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
        >
          Powered by Gemini
        </a>
      </div>
    </header>
  );
};
