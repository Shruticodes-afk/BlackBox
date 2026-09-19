import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Database, CreditCard, Mail, Key, ArrowRight, Zap, Network, Activity } from 'lucide-react';

const KineticSculpture = lazy(() => import('../components/KineticSculpture'));

export default function Home() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-black font-sans text-slate-200">
      
      {/* Tactical Status Bar */}
      <div className="w-full flex justify-between items-center px-4 md:px-8 py-2 border-b border-slate-800 font-mono text-[10px] md:text-xs text-[#ccff00] uppercase tracking-[0.2em] bg-black">
        <span>[ CASCADEOPS DASHBOARD | DEPENDENCY SIMULATION ENGINE ]</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span> 
          [ STATUS: LIVE ]
        </span>
      </div>

      <div className="flex flex-1 w-full max-w-7xl mx-auto items-start">
        {/* Sidebar Navigation */}
        <aside className="w-[150px] border-r border-slate-800 p-4 mr-10 hidden md:block shrink-0 sticky top-0 h-[calc(100vh-40px)] overflow-y-auto">
          <h3 className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-3">Documentation</h3>
          <nav className="flex flex-col gap-4">
            <button onClick={() => scrollTo('overview')} className="text-left text-sm font-medium text-slate-500 hover:text-[#ccff00] bg-transparent hover:bg-transparent outline-none focus:outline-none border-none shadow-none transition-colors">Overview</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-left text-sm font-medium text-slate-500 hover:text-[#ccff00] bg-transparent hover:bg-transparent outline-none focus:outline-none border-none shadow-none transition-colors">How It Works</button>
            <button onClick={() => scrollTo('features')} className="text-left text-sm font-medium text-slate-500 hover:text-[#ccff00] bg-transparent hover:bg-transparent outline-none focus:outline-none border-none shadow-none transition-colors">Features</button>
            <button onClick={() => scrollTo('get-started')} className="text-left text-sm font-medium text-slate-500 hover:text-[#ccff00] bg-transparent hover:bg-transparent outline-none focus:outline-none border-none shadow-none transition-colors">Get Started</button>
            <button onClick={() => scrollTo('supported-services')} className="text-left text-sm font-medium text-slate-500 hover:text-[#ccff00] bg-transparent hover:bg-transparent outline-none focus:outline-none border-none shadow-none transition-colors">Supported Services</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-12 lg:p-16 w-full">
          <div className="w-full space-y-24 pb-32">
            
            {/* Tactical Hero Section */}
            <section id="overview" className="space-y-8 relative max-w-6xl mx-auto w-full pb-20">
  {/* Hero Content Grid */}
    <div className="relative flex-1 flex flex-col md:flex-row items-center min-h-[500px] animate-[fadeInUp_1s_ease-out]">
      {/* Left Text */}
      <div className="relative z-20 w-full md:w-1/2 space-y-8">
        <h1 className="text-5xl lg:text-[4.5rem] font-extrabold tracking-tight text-white leading-[1.05]">
          Predicting <br/>
          Service Failures. <br/>
          <span className="text-[#ccff00]">Before They Cascade.</span>
        </h1>
        
        {/* Input Row */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 p-1.5 rounded-full w-full max-w-lg shadow-inner mt-8">
          <input 
            type="text" 
            placeholder="Enter a service name to simulate..." 
            className="flex-1 bg-transparent border-none outline-none text-white px-4 text-sm placeholder:text-zinc-500"
          />
          <Link to="/dashboard" className="bg-[#ccff00] text-black font-bold px-5 py-2.5 rounded-full text-sm hover:scale-105 transition-transform flex items-center gap-2 shrink-0 shadow-[0_0_15px_rgba(204,255,0,0.4)]">
            Test Simulation <ArrowRight size={14} />
          </Link>
        </div>
      </div>
      
      {/* Right Visual (Globe) */}
      <div className="absolute md:relative right-[-100px] md:right-0 top-1/2 md:top-0 -translate-y-1/2 md:translate-y-0 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] pointer-events-none z-10 flex items-center justify-center opacity-30 md:opacity-100">
        {/* The Globe */}
        <div className="absolute inset-0 right-[-150px] top-[-50px]">
          <Suspense fallback={<div className="w-full h-full rounded-full border border-zinc-900 animate-pulse"></div>}>
            <KineticSculpture />
          </Suspense>
        </div>
        
        </div>
    </div>
  

  {/* Testimonial / Social Proof Strip */}
  <div className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-[1.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 animate-[fadeInUp_1s_ease-out_0.3s_both] shadow-xl">
    <div className="flex-1 max-w-2xl">
      <p className="text-xl md:text-2xl font-medium text-white italic leading-tight">
        "Game-changing for our demo. We instantly visualized exactly how a single microservice outage would crater our entire backend."
      </p>
      <div className="mt-5 flex items-center gap-3 text-sm">
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-white font-semibold">Lead Architect</div>
          <div className="text-zinc-500">Enterprise Systems Inc.</div>
        </div>
      </div>
    </div>
    
    <div className="flex flex-wrap items-center justify-end gap-8 opacity-40 shrink-0">
      <div className="font-extrabold text-xl tracking-tighter flex items-center gap-1.5"><Database size={24}/> TEAM A</div>
      <div className="font-extrabold text-xl tracking-tighter flex items-center gap-1.5"><Network size={24}/> TEAM B</div>
      <div className="font-extrabold text-xl tracking-tighter flex items-center gap-1.5"><Activity size={24}/> TEAM C</div>
    </div>
  </div>
</section>

            {/* How It Works */}
            <section id="how-it-works" className="space-y-6 pt-12 border-t border-slate-900">
              <h2 className="text-3xl font-bold text-white tracking-tight">How It Works</h2>
              <div className="space-y-5 text-lg text-slate-400 leading-relaxed max-w-3xl">
                <p>
                  Modern distributed systems rely on intricate webs of dependencies. When a core service fails, the downstream effects are often unpredictable. BlackBox solves this by dynamically mapping these relationships into a visual graph. 
                </p>
                <p>
                  By intentionally simulating outages (chaos engineering), you can trace the exact lifecycle of a request as it traverses the API gateway, hits timeouts, trips circuit breakers, and ultimately fails—all logged meticulously in the Digital Black Box.
                </p>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="space-y-6 pt-12 border-t border-slate-900">
              <h2 className="text-3xl font-bold text-white tracking-tight">Core Capabilities</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <li className="bg-[#050505] p-6 border border-slate-800 flex flex-col gap-3 hover:border-slate-600 transition-colors">
                  <div className="text-[#ccff00]">
                    <Network size={24} />
                  </div>
                  <span className="font-bold text-lg text-white">Real-Time Graph</span>
                  <span className="text-slate-400 leading-relaxed">Live visualization of dependencies and service health powered by Supabase WebSockets.</span>
                </li>
                <li className="bg-[#050505] p-6 border border-slate-800 flex flex-col gap-3 hover:border-slate-600 transition-colors">
                  <div className="text-[#ccff00]">
                    <Zap size={24} />
                  </div>
                  <span className="font-bold text-lg text-white">Chaos Simulations</span>
                  <span className="text-slate-400 leading-relaxed">Instantly kill backend services to observe blast radius and calculate criticality scores.</span>
                </li>
              </ul>
              <div className="pt-4">
                <Link to="/features" className="text-[#ccff00] hover:text-white font-bold tracking-widest text-xs uppercase flex items-center gap-2 w-fit transition-colors">
                  VIEW ALL FEATURES <ArrowRight size={14} />
                </Link>
              </div>
            </section>

            {/* Get Started */}
            <section id="get-started" className="space-y-6 pt-12 border-t border-slate-900">
              <h2 className="text-3xl font-bold text-white tracking-tight">Get Started</h2>
              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                Ready to test your system's resilience? Head over to the Live Dashboard to begin simulating outages and reviewing incident reports.
              </p>
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 bg-[#ccff00] hover:bg-white text-black px-6 py-3 font-bold uppercase tracking-wider text-sm transition-colors"
              >
                GO TO DASHBOARD <ArrowRight size={16} />
              </Link>
            </section>

            {/* Supported Services */}
            <section id="supported-services" className="space-y-6 pt-12 border-t border-slate-900">
              <h2 className="text-3xl font-bold text-white tracking-tight">What BlackBox Monitors</h2>
              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                The platform currently tracks health statuses, timeouts, and cascading failure events across the following core infrastructure components:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-[#050505] border border-slate-800 p-6 flex flex-col gap-4 hover:border-[#ccff00]/50 transition-colors">
                  <div className="text-slate-300">
                    <Database size={24} />
                  </div>
                  <span className="font-bold text-lg text-white">DBService</span>
                  <p className="text-sm text-slate-500 leading-relaxed">PostgreSQL clustering & connection pooling</p>
                </div>
                
                <div className="bg-[#050505] border border-slate-800 p-6 flex flex-col gap-4 hover:border-[#ccff00]/50 transition-colors">
                  <div className="text-slate-300">
                    <CreditCard size={24} />
                  </div>
                  <span className="font-bold text-lg text-white">PaymentService</span>
                  <p className="text-sm text-slate-500 leading-relaxed">Stripe gateway integration & webhooks</p>
                </div>

                <div className="bg-[#050505] border border-slate-800 p-6 flex flex-col gap-4 hover:border-[#ccff00]/50 transition-colors">
                  <div className="text-slate-300">
                    <Key size={24} />
                  </div>
                  <span className="font-bold text-lg text-white">AuthService</span>
                  <p className="text-sm text-slate-500 leading-relaxed">JWT generation and OAuth validation</p>
                </div>

                <div className="bg-[#050505] border border-slate-800 p-6 flex flex-col gap-4 hover:border-[#ccff00]/50 transition-colors">
                  <div className="text-slate-300">
                    <Mail size={24} />
                  </div>
                  <span className="font-bold text-lg text-white">EmailService</span>
                  <p className="text-sm text-slate-500 leading-relaxed">SMTP dispatch and PDF invoices</p>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
