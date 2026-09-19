import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Skull, LayoutDashboard, Home as HomeIcon, Star, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Features from './pages/Features';

export default function App() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium outline-none focus:outline-none select-none [-webkit-tap-highlight-color:transparent] ${
          isActive 
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Icon size={16} />
        {children}
      </Link>
    );
  };

  return (
    <div className="w-full h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 flex flex-col font-sans overflow-hidden transition-colors">
      {/* Global Navigation Bar */}
      <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 flex justify-between items-center backdrop-blur-sm z-10 shrink-0 transition-colors">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative group"><Skull className="text-[#ccff00] relative z-10 glitch-icon" /></div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Black<span className="text-slate-500 font-light">Box</span></h1>
        </Link>
        
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-2">
            <NavLink to="/" icon={HomeIcon}>Home</NavLink>
            <NavLink to="/features" icon={Star}>Features</NavLink>
            <NavLink to="/dashboard" icon={LayoutDashboard}>Live Dashboard</NavLink>
          </nav>
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none focus:outline-none select-none [-webkit-tap-highlight-color:transparent]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
