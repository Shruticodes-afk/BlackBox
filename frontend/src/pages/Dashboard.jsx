import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Terminal, Activity, AlertTriangle, ShieldCheck, RefreshCw, Zap, CreditCard, Database, Key, Mail, Monitor, Server } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nzaxjczpulglafajxkuk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xXaKYHzDVT__SDWTkgE2gQ_DmuaNFnn';
const supabase = createClient(supabaseUrl, supabaseKey);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const suggestedFixes = {
  'PaymentService': 'Add idempotency key + retry with exponential backoff',
  'DBService': 'Add connection pooling with automatic failover / read replica',
  'AuthService': 'Cache valid sessions temporarily / add fallback auth provider',
  'EmailService': 'Queue emails for retry instead of failing the request'
};

const CustomNode = ({ data }) => {
  const isHealthy = data.status === 'healthy';
  const isService = data.type === 'service';
  
  const [pulse, setPulse] = useState(false);
  const prevStatus = useRef(data.status);

  useEffect(() => {
    if (prevStatus.current === 'healthy' && data.status === 'failed') {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 2000);
      return () => clearTimeout(timer);
    }
    prevStatus.current = data.status;
  }, [data.status]);
  
  return (
    <div className={`group relative px-4 py-2 rounded-md border-2 transition-colors duration-500 ${isHealthy ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-lg' : 'border-rose-500 bg-rose-950/40 text-rose-100'} ${pulse ? 'animate-pulse shadow-[0_0_30px_rgba(244,63,94,0.8)]' : 'shadow-lg'}`}>
      {/* CSS Hover Tooltip */}
      <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-max max-w-[200px] md:max-w-[300px] bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-slate-700 text-center leading-relaxed">
        {data.tooltip}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-400 border-none" />
      <div className="flex flex-col items-center">
        <div className="font-bold text-sm flex items-center gap-2">
          {isService ? <Zap size={14} /> : <Activity size={14} />}
          {data.label}
        </div>
        <div className="text-xs opacity-80 mt-1 uppercase tracking-wider">
          {data.status}
        </div>
        {isService && data.criticality !== undefined && (
          <div className="text-[10px] mt-2 opacity-60">
            Crit Score: {data.criticality}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-400 border-none" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 80;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    let x = nodeWithPosition.x - nodeWidth / 2;
    let y = nodeWithPosition.y - nodeHeight / 2;
    
    if (node.data.label === 'FrontendApp') {
      y = -150;
      x = (dagreGraph.graph().width || 1000) / 2 - nodeWidth / 2;
    } else if (node.data.label === 'ServerInfra') {
      y = dagreGraph.graph().height ? dagreGraph.graph().height + 50 : 400;
      x = (dagreGraph.graph().width || 1000) / 2 - nodeWidth / 2;
    }

    return {
      ...node,
      position: { x, y },
      targetPosition: 'top',
      sourcePosition: 'bottom',
    };
  });

  return { nodes: newNodes, edges };
};


export default function Dashboard() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [services, setServices] = useState([]);
  
  const [summary, setSummary] = useState(null);
  const [simulatingId, setSimulatingId] = useState(null);
  const [traces, setTraces] = useState([]);
  const [selectedProject, setSelectedProject] = useState('demo');
  const [hideIsolated, setHideIsolated] = useState(false);
  const [visibleTraces, setVisibleTraces] = useState([]);
  const terminalRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

  const pollIntervalRef = useRef(null);

  const fetchGraph = async () => {
    try {
      const res = await fetch(`${API_URL}/graph?project=${selectedProject}`);
      const data = await res.json();
      
      const edges = data.edges;
      const formattedNodes = data.nodes.map(n => {
        let tooltip = '';
        if (n.type === 'service') {
           const dependentCount = edges.filter(e => e.source === n.id).length;
           tooltip = `${n.data.label} — Criticality: ${n.data.criticality || 0}/100 — ${dependentCount} feature${dependentCount !== 1 ? 's' : ''} depend${dependentCount === 1 ? 's' : ''} on this`;
        } else {
           const sourceEdges = edges.filter(e => e.target === n.id);
           const sourceNames = sourceEdges.map(e => {
              const sourceNode = data.nodes.find(sn => sn.id === e.source);
              return sourceNode ? sourceNode.data.label : 'Unknown';
           }).join(', ');
           tooltip = `${n.data.label} — Depends on: ${sourceNames || 'Nothing'}`;
        }
        return {
          ...n,
          type: 'custom',
          data: { ...n.data, type: n.type, tooltip }
        };
      });

      const formattedEdges = data.edges.map(e => ({
        ...e,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
        style: { stroke: '#64748b', strokeWidth: 2 },
        animated: true
      }));

      let activeNodes = formattedNodes;
        if (hideIsolated) {
          activeNodes = activeNodes.filter(n => {
            return formattedEdges.some(e => e.source === n.id || e.target === n.id);
          });
        }

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          activeNodes,
          formattedEdges
        );
        
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setServices(layoutedNodes.filter(n => n.data.type === 'service'));
      

    } catch (err) {
      console.error('Failed to fetch graph', err);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [selectedProject, hideIsolated]);

  // Auto zoom-to-fit when the graph instance and nodes are ready
  useEffect(() => {
    if (rfInstance && nodes.length > 0) {
      // Small delay ensures DOM is fully painted
      const timer = setTimeout(() => {
        rfInstance.fitView({ padding: 0.2, duration: 800 });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [rfInstance, nodes.length]);

  useEffect(() => {
    if (traces.length === 0) {
      if (visibleTraces.length !== 0) setVisibleTraces([]);
      return;
    }
    if (traces.length === 1 && visibleTraces.length === 0) {
      setVisibleTraces(traces);
      return;
    }
    if (visibleTraces.length < traces.length) {
      const timer = setTimeout(() => {
        setVisibleTraces(traces.slice(0, visibleTraces.length + 1));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [traces, visibleTraces]);

  // Auto-scroll terminal when visibleTraces changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleTraces]);

  useEffect(() => {
    const handleUpdate = (payload) => {
      const updatedRecord = payload.new;
      setNodes(nds => nds.map(node => {
        if (node.id === updatedRecord.id) {
          return {
            ...node,
            data: { ...node.data, status: updatedRecord.status }
          };
        }
        return node;
      }));
      
      // Update connected edges visually based on status
      if (updatedRecord.status === 'failed') {
        setEdges(eds => eds.map(edge => {
          if (edge.target === updatedRecord.id || edge.source === updatedRecord.id) {
            return { ...edge, style: { stroke: '#f43f5e', strokeWidth: 3 }, animated: true };
          }
          return edge;
        }));
      } else if (updatedRecord.status === 'healthy') {
        setEdges(eds => eds.map(edge => {
          if (edge.target === updatedRecord.id || edge.source === updatedRecord.id) {
            return { ...edge, style: { stroke: '#64748b', strokeWidth: 2 }, animated: true };
          }
          return edge;
        }));
      }
    };

    const serviceSub = supabase
      .channel('services-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'services' }, handleUpdate)
      .subscribe();

    const featureSub = supabase
      .channel('features-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'features' }, handleUpdate)
      .subscribe();

    return () => {
      supabase.removeChannel(serviceSub);
      supabase.removeChannel(featureSub);
    };
  }, [setNodes]);

  const handleSimulate = async (serviceNode) => {
    try {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setSimulatingId(serviceNode.id);
      setSummary({ loading: true, rootCause: serviceNode.data.label });
      setVisibleTraces([]);
      setTraces([{ step: 'Calculating blast radius impact...', status: 'pending', timestamp: new Date().toISOString() }]);
      
      // Artificial delay to simulate complex impact calculation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const traceRes = await fetch(`${API_URL}/trace/${serviceNode.id}`, { method: 'POST' });
      const { request_id } = await traceRes.json();
      
      const simRes = await fetch(`${API_URL}/simulate/${serviceNode.id}`, { method: 'POST' });
      const simData = await simRes.json();
      
      setSummary({
        rootCause: serviceNode.data.label,
        affectedCount: simData.affected_features.length,
        severity: simData.severity_score,
        fix: suggestedFixes[serviceNode.data.label] || 'Investigate logs and rollback recent deployment.'
      });
      
      setSimulatingId(null);
      pollTraces(request_id);
    } catch (err) {
      console.error(err);
      setSimulatingId(null);
    }
  };

  const pollTraces = (requestId) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    let count = 0;
    pollIntervalRef.current = setInterval(async () => {
      count++;
      try {
        const res = await fetch(`${API_URL}/trace/${requestId}`);
        const data = await res.json();
        if (data && data.length > 0) setTraces(data);
        
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
        if (data.some(d => d.status === 'failed') || count > 10) {
          clearInterval(pollIntervalRef.current);
        }
      } catch (e) {
        console.error(e);
      }
    }, 1000);
  };

  const handleReset = async () => {
    console.log("Reset clicked");
    try {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      await fetch(`${API_URL}/reset`, { method: 'POST' });
      setSummary(null);
      setTraces([]);
      fetchGraph();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onInit={setRfInstance}
            fitView
            colorMode="dark"
          >
            <Background color="#334155" gap={20} size={1} />
            <Controls className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 fill-slate-300" />
          </ReactFlow>
        </div>

        <div className="w-96 border-l border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col z-10 shadow-xl overflow-y-auto">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-4 mb-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white truncate">
                  <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                  <span className="truncate">Chaos Engineering</span>
                </h2>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:bg-slate-700 text-xs font-medium px-3 py-1.5 rounded-md transition-colors border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:border-slate-600 cursor-pointer shadow-sm shrink-0"
                >
                  <RefreshCw size={14} /> Reset
                </button>
              </div>
              
              <div className="flex items-center bg-slate-200 dark:bg-slate-800/50 p-1 rounded-lg">
                <button 
                  onClick={() => setSelectedProject('demo')}
                  className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${selectedProject === 'demo' ? 'bg-[#ccff00] text-black shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Demo Project
                </button>
                <button 
                  onClick={() => setSelectedProject('her-safety')}
                  className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${selectedProject === 'her-safety' ? 'bg-[#ccff00] text-black shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Her-Safety
                </button>
              </div>
            </div>
              <div className="flex flex-col gap-3">
                {services.map(s => (
                  <button
                    key={s.id}
                    disabled={simulatingId !== null}
                    onClick={() => handleSimulate(s)}
                    className={`w-full text-left px-4 py-3 bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg transition-all duration-200 flex justify-between items-center group ${simulatingId ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-rose-950/40 hover:border-rose-500/50 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)]'}`}
                  >
                    <div className="flex items-center gap-3">
                      {simulatingId === s.id ? (
                        <RefreshCw size={16} className="animate-spin text-rose-400" />
                      ) : (
                        s.data.label.includes('Payment') ? <CreditCard size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-rose-400 transition-colors" /> :
                        s.data.label.includes('DB') ? <Database size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-rose-400 transition-colors" /> :
                        s.data.label.includes('Auth') ? <Key size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-rose-400 transition-colors" /> :
                        s.data.label.includes('Email') ? <Mail size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-rose-400 transition-colors" /> :
                          s.data.label.includes('FrontendApp') ? <Monitor size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-rose-400 transition-colors" /> :
                          s.data.label.includes('ServerInfra') ? <Server size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-rose-400 transition-colors" /> :
                        <Zap size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-rose-400 transition-colors" />
                      )}
                      <span className={`font-medium text-sm transition-colors ${simulatingId === s.id ? 'text-rose-400' : 'group-hover:text-rose-400'}`}>
                        {simulatingId === s.id ? 'Calculating impact...' : `Simulate Failure: ${s.data.label}`}
                      </span>
                    </div>
                    {simulatingId !== s.id && <Zap size={14} className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity" />}
                  </button>
                ))}
              </div>
          </div>

          {summary && (
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-200/20 dark:bg-slate-800/20">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                <AlertTriangle size={18} className="text-amber-500" />
                Incident Report
              </h2>
                {summary.loading ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <RefreshCw size={24} className="animate-spin text-amber-500/80" />
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">Calculating impact...</div>
                  </div>
                ) : (
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex justify-between items-center border-b border-slate-300/50 dark:border-slate-700/50 pb-2">
                    <span className="text-slate-500 dark:text-slate-600 dark:text-slate-400">Root Cause</span>
                    <span className="font-mono text-rose-400 font-semibold">{summary.rootCause}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-300/50 dark:border-slate-700/50 pb-2">
                    <span className="text-slate-500 dark:text-slate-600 dark:text-slate-400">Affected Features</span>
                    <span className="font-bold text-slate-900 dark:text-white">{summary.affectedCount}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-300/50 dark:border-slate-700/50 pb-2">
                    <span className="text-slate-500 dark:text-slate-600 dark:text-slate-400">Severity</span>
                    <div className="flex flex-col items-end gap-1 mt-1">
                      <div className="w-24 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${summary.severity <= 30 ? 'bg-emerald-500' : summary.severity <= 70 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                          style={{ width: `${summary.severity}%` }}
                        ></div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${summary.severity <= 30 ? 'text-emerald-500' : summary.severity <= 70 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {summary.severity <= 30 ? 'Low Impact' : summary.severity <= 70 ? 'Moderate' : 'Critical'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 bg-blue-950/30 border border-blue-900/50 p-3 rounded-md">
                    <div className="text-xs text-blue-400 uppercase font-bold mb-1">Suggested Fix</div>
                    <div className="text-blue-100">{summary.fix}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-6 flex-1 flex flex-col overflow-hidden min-h-[500px]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white shrink-0">
              <Terminal size={18} className="text-slate-500 dark:text-slate-600 dark:text-slate-400" />
              Digital Black Box
            </h2>
            <div 
              ref={terminalRef}
              className="flex-1 bg-slate-100 dark:bg-black rounded-lg p-4 font-mono text-xs overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-inner min-h-0"
            >
              {visibleTraces.length === 0 ? (
                <div className="text-slate-500 dark:text-slate-600 italic">Waiting for telemetry...</div>
              ) : (
                visibleTraces.map((t, i) => (
                  <div key={i} className="mb-2">
                    <span className="text-slate-500 dark:text-slate-500">[{new Date(t.timestamp || Date.now()).toISOString().substring(11, 23)}]</span>{' '}
                    <span className={
                      t.status === 'failed' || t.status === 'error' ? 'text-rose-500' : 
                      t.status === 'pending' ? 'text-amber-400' : 'text-emerald-400'
                    }>[{t.status.toUpperCase()}]</span>{' '}
                    <span className={`text-slate-700 dark:text-slate-300 ${t.status === 'failed' ? 'font-bold !text-rose-500' : ''}`}>{t.step}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
