export const Table = ({ headers, children, className }) => (
  <div className={`bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm ${className}`}>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-800/20 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
            {headers.map((header, idx) => (
              <th key={idx} className={`px-6 py-5 ${header.className || ''}`}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {children}
        </tbody>
      </table>
    </div>
  </div>
);

export const TableRow = ({ children, className, onClick }) => (
  <tr 
    onClick={onClick}
    className={`hover:bg-slate-800/30 transition-colors group ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-slate-800 text-slate-400 border-slate-700",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
};
