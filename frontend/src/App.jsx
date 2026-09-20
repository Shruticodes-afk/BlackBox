import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Features from './pages/Features';

export default function App() {
  return (
    <div className="w-full h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 flex flex-col font-sans overflow-hidden transition-colors">
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
