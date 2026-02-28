import { Map as MapIcon, MapPin, Navigation, Phone, TrendingUp, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

const DriverStatusCard = ({ driver }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br transition-opacity duration-500 opacity-0 group-hover:opacity-10 pointer-events-none ${
      driver.progress >= 80 ? 'from-emerald-500 to-transparent' : 'from-blue-500 to-transparent'
    }`} />
    
    <div className="flex justify-between items-start mb-6">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center relative shadow-inner overflow-hidden border border-slate-700">
           <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-700" />
           <span className="relative text-2xl font-black text-white">{driver.name.charAt(0)}</span>
           <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{driver.name}</h3>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mt-1">
            <Truck size={12}/>
            <span>HR-26-AB-1234</span>
            <span className="mx-1">•</span>
            <Phone size={12}/>
            <span>{driver.phone}</span>
          </div>
        </div>
      </div>
      <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-700">
        <Navigation size={18} />
      </button>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Shift Progress</span>
        <span className="text-sm font-black text-white">{driver.progress}%</span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            driver.progress >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'
          }`}
          style={{ width: `${driver.progress}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-800/50 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total</p>
          <p className="text-sm font-black text-white">{driver.total}</p>
        </div>
        <div className="bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10 text-center">
          <p className="text-[10px] font-bold text-emerald-500/60 uppercase mb-1">Done</p>
          <p className="text-sm font-black text-emerald-400">{driver.done}</p>
        </div>
        <div className="bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10 text-center">
          <p className="text-[10px] font-bold text-amber-500/60 uppercase mb-1">Left</p>
          <p className="text-sm font-black text-amber-400">{driver.total - driver.done}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={14} className="text-emerald-500" />
          <span className="text-xs font-bold text-slate-300">₹{driver.collection} Collected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-blue-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Sector 42 ...</span>
        </div>
      </div>
    </div>
  </div>
);

const LiveMonitoring = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/staff');
      // Filter for drivers and enrich with mock status for UI demo
      const activeDrivers = res.data
        .filter(u => u.role === 'DRIVER')
        .map(u => ({
          id: u.id,
          name: u.name,
          phone: u.phone,
          vehicle: u.vehicleNumber || 'HR-26-AB-1234',
          total: 10,
          done: 7,
          progress: 70,
          collection: 4500
        }));
      setDrivers(activeDrivers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    const interval = setInterval(fetchDrivers, 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
             <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
             Live Monitoring
          </h2>
          <p className="text-slate-400 mt-1">Real-time tracking of staff on the field</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            <MapIcon size={20} />
            <span>Switch to Map View</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {drivers.map(driver => (
          <DriverStatusCard key={driver.id} driver={driver} />
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 h-[400px] relative overflow-hidden group shadow-2xl">
         {/* Map Placeholder */}
         <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center flex-col gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <MapIcon size={80} className="relative text-slate-600 group-hover:text-blue-500 transition-colors duration-700" />
            </div>
            <div className="text-center relative">
              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Global Fleet Map</h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Connect GPS Service to visualize real-time movements</p>
            </div>
            <button className="px-8 py-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600/20 hover:border-blue-500/40 transition-all">
              Initialize Tracking
            </button>
         </div>
         {/* Map Simulation - Static paths */}
         <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100">
            <path d="M0 20 Q 25 10 50 40 T 100 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400" />
            <path d="M10 100 L 40 60 L 80 90" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400" />
            <circle cx="50" cy="40" r="1" className="fill-blue-500" />
            <circle cx="80" cy="90" r="1" className="fill-blue-500" />
         </svg>
      </div>
    </div>
  );
};

export default LiveMonitoring;
