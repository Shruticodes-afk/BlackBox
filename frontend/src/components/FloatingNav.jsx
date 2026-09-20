import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function FloatingNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
      <Link 
        to="/" 
        className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-md border border-slate-700 backdrop-blur-sm transition-colors shadow-lg text-sm font-medium"
      >
        <Home size={16} />
        Back to Home
      </Link>
      
      <button 
        onClick={toggleTheme}
        className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-md border border-slate-700 backdrop-blur-sm transition-colors shadow-lg"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
}
