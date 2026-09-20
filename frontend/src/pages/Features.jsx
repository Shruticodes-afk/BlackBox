import FloatingNav from '../components/FloatingNav';
import { Network, Terminal, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Dependency Graph Visualization",
      icon: Network,
      color: "text-blue-400",
      description: "A highly interactive, automatically laid-out node graph built on React Flow. It accurately maps the complex web of dependencies between your frontend features and backend microservices."
    },
    {
      title: "Chaos Engineering Simulations",
      icon: ShieldCheck,
      color: "text-emerald-400",
      description: "Directly manipulate the state of your infrastructure by 'killing' services at will. Watch as the system calculates the blast radius and cascades the failure to dependent downstream features."
    },
    {
      title: "Incident Reports",
      icon: AlertTriangle,
      color: "text-amber-400",
      description: "When an outage is triggered, BlackBox generates a comprehensive incident report identifying the root cause, the total number of affected features, a calculated severity score, and automated remediation suggestions."
    },
    {
      title: "Black Box Tracing",
      icon: Terminal,
      color: "text-rose-400",
      description: "A digital flight recorder for your application. It polls real-time telemetry events and logs the exact sequence of lifecycle steps a request took before it failed, right down to the millisecond."
    }
  ];

  return (
    <div className="p-12 max-w-5xl mx-auto w-full relative">
      <div className="-ml-8 -mt-8 mb-8"><FloatingNav /></div>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Platform Features</h1>
        <p className="text-slate-500 dark:text-slate-600 dark:text-slate-400 text-lg">
          BlackBox provides a suite of tools designed to visualize, test, and debug 
          distributed microservice architectures under catastrophic failure conditions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-lg hover:border-slate-300 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <Icon className={f.color} size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{f.title}</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
