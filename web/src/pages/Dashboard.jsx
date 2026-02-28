import {
    ArrowUpRight,
    Clock,
    CreditCard,
    IndianRupee,
    PackageCheck,
    TrendingUp,
    Truck,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';

const DashboardCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          <ArrowUpRight size={14} />
          {trend}%
        </span>
      )}
    </div>
    <p className="text-slate-400 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeDrivers: 0,
    deliveriesAssigned: 0,
    cylindersDelivered: 0,
    pendingDeliveries: 0,
    cashCollected: 0,
    upiPayments: 0
  });

  const chartData = [
    { name: '08:00', deliveries: 2 },
    { name: '10:00', deliveries: 5 },
    { name: '12:00', deliveries: 8 },
    { name: '14:00', deliveries: 10 },
    { name: '16:00', deliveries: 7 },
    { name: '18:00', deliveries: 4 },
  ];

  const paymentData = [
    { name: 'Cash', val: stats.cashCollected },
    { name: 'UPI', val: stats.upiPayments },
  ];

  const COLORS = ['#3b82f6', '#06b6d4'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        const data = res.data.metrics;
        setStats({
          activeDrivers: data.activeDrivers,
          deliveriesAssigned: data.pendingOrders + data.deliveredToday,
          cylindersDelivered: data.deliveredToday,
          pendingDeliveries: data.pendingOrders,
          cashCollected: data.cashCollection,
          upiPayments: data.upiCollection
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-slate-400 mt-1">Real-time status of your delivery operations</p>
        </div>
        <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-slate-300">Live Updates Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <DashboardCard title="Active Drivers" value={stats.activeDrivers} icon={Users} color="blue" trend={12} />
        <DashboardCard title="Deliveries Assigned" value={stats.deliveriesAssigned} icon={Truck} color="indigo" />
        <DashboardCard title="Cylinders Delivered" value={stats.cylindersDelivered} icon={PackageCheck} color="emerald" trend={8} />
        <DashboardCard title="Pending" value={stats.pendingDeliveries} icon={Clock} color="orange" />
        <DashboardCard title="Cash Collected" value={`₹${stats.cashCollected}`} icon={IndianRupee} color="cyan" trend={5} />
        <DashboardCard title="UPI Payments" value={`₹${stats.upiPayments}`} icon={CreditCard} color="purple" trend={15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-blue-500" />
              Delivery Velocity (Today)
            </h3>
            <select className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg px-3 py-2 focus:outline-none">
              <option>Last 24 Hours</option>
              <option>Yesterday</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="deliveries" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-8">Payment Split</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#f8fafc', fontWeight: 'bold'}} width={60} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}} />
                <Bar dataKey="val" radius={[0, 10, 10, 0]} barSize={40}>
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl border border-slate-800">
              <span className="text-sm font-medium text-slate-400">Total Collection</span>
              <span className="text-lg font-bold text-white">₹{stats.cashCollected + stats.upiPayments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
