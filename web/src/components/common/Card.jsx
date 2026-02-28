import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, hover = true }) => (
  <div className={twMerge(
    "bg-slate-900/50 border border-slate-800 rounded-3xl p-6 transition-all duration-300",
    hover && "hover:border-slate-700 hover:bg-slate-900/80",
    className
  )}>
    {children}
  </div>
);

export const StatsCard = ({ title, value, icon: Icon, color = "blue", trend }) => (
  <Card className="group relative overflow-hidden">
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={twMerge(
        "p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
        getIconColor(color)
      )}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={twMerge(
          "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider",
          trend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </div>
    
    {/* Decorative background circle */}
    <div className={twMerge(
      "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
      getBgColor(color)
    )} />
  </Card>
);

const getIconColor = (color) => {
  const mapping = {
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    rose: "bg-rose-500/10 text-rose-400",
    purple: "bg-purple-500/10 text-purple-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    orange: "bg-orange-500/10 text-orange-400",
    indigo: "bg-indigo-500/10 text-indigo-400",
  };
  return mapping[color] || mapping.blue;
};

const getBgColor = (color) => {
  const mapping = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    orange: "bg-orange-500",
    indigo: "bg-indigo-500",
  };
  return mapping[color] || mapping.blue;
};
